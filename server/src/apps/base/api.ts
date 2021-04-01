import {InvalidParams, UnauthorizedError} from '@apps/base/errors'
import {AuthUser, Method, MethodInitData, Req} from '@apps/base/Method'
import {getRes} from '@apps/base/templates'
import {Query} from '@modules/db/pool'
import Logger from '@modules/logger'
import {JSONSchemaType} from 'ajv'
import {NextFunction, Response} from 'express'
import formidable, {Fields, Files} from 'formidable'
import ajv from '@modules/ajv'
import jwt from 'jsonwebtoken'
import {config} from '@utils/config'

export type ApiDir = Record<string, {
    queries: Record<string, string>,
    methods: Record<string, Method>,
    schemas: Record<string, JSONSchemaType<any>>
}>

type System = {
    [app: string]: {
        [version: string]: {
            methods: {
                [name: string]: Method
            }
            // queries: {
            //     [name: string]: Query
            // }
            // schemas: {
            //     [name: string]: JSONSchemaType<any>
            // }
        }
    }
}

class Api {
    system: System = {}
    log: Logger

    constructor() {
        this.log = new Logger({
            owner: 'API',
        })
    }

    async init(appName: string) {
        let api: ApiDir
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            api = require(`@apps/${appName}/api`).default
            if (!api) {
                throw new Error()
            }
        } catch (error) {
            this.log.warn(`No api directory found for app ${appName}, please check that it uses 'default' export`)
            return null
        }

        this.system[appName] = {}

        for (const [version, entities] of Object.entries(api)) {
            let queries: Record<string, string> = {}
            let schemas: Record<string, JSONSchemaType<any>> = {}

            if (!entities.queries) {
                this.log.warn(`No queries found for app ${appName}`)
            } else {
                queries = entities.queries
            }

            if (!entities.schemas) {
                this.log.warn(`No schemas found for app ${appName}`)
            } else {
                schemas = entities.schemas
            }

            this.system[appName][version] = {
                methods: {},
                // queries: {},
                // schemas: {},
            }

            // Init methods
            for (const [methodName, method] of Object.entries(entities.methods)) {
                // FIXME
                //  What's wrong, babe, I forgot... ??
                const schema = schemas[method.getName()] || {}
                if (!schema && !method.formData) {
                    throw new Error(`Cannot find schema for method: ${appName}/${method.getName()}`)
                }

                const methodInitData: MethodInitData = {
                    appName,
                    queries,
                    schema,
                }

                try {
                    await method.init(methodInitData)
                } catch (error) {
                    this.log.error(`Failed to init method ${methodName} in app ${appName}:`, error)
                }

                this.system[appName][version].methods[methodName] = method
            }
        }
    }

    getMethod(req: any): Method {
        const reqObj: Req = req.body

        if (!this.system[reqObj.app]) {
            throw new Error('Service does not exists')
        }

        if (!this.system[reqObj.app][`v${reqObj.v}`]) {
            throw new Error('Version is not supported')
        }

        const method = this.system[reqObj.app][`v${reqObj.v}`].methods[reqObj.method]

        if (!method) {
            throw new Error('Method does not exists')
        }

        return method
    }

    async callMethod(req: any, res: Response, next: NextFunction) {
        const reqObj: Req = req.body

        // TODO: Validate api

        const method = this.getMethod(req)

        let user: AuthUser | undefined = undefined
        if (method.auth) {
            let token: string

            if (config.auth.useHeader && req.headers.authorization.split(' ')[0] === 'Bearer') {
                console.log('use bearer')
                token = req.headers.authorization.split(' ')[1].trim()
                console.log('token', token)
            } else if (reqObj.token) {
                token = reqObj.token
            } else {
                throw new UnauthorizedError()
            }

            try {
                await jwt.verify(token, Buffer.from(process.env.JWT_SECRET!, 'base64'), {
                    algorithms: ['HS256'],
                })
                const jwtData = await jwt.decode(token, {
                    complete: true,
                }) as Record<any, any>

                user = jwtData.payload.userData

                if (!user) {
                    throw new UnauthorizedError('invalid_payload')
                }
            } catch (error) {
                this.log.error(error)
                throw new UnauthorizedError('invalid_token')
            }
        }

        if (method.formData) {
            const form = new formidable.IncomingForm()

            form.parse(req.formData, async (err: Error, fields: Fields, files: Files) => {
                if (err) {
                    return next(err)
                }

                const result = await method.runFormData({
                    ...req.body,
                    formData: {
                        fields,
                        files,
                    },
                }, user)

                return getRes(result)
            })
        } else {
            await method.validate(req.body)
            const result = await method.run(req.body, user)
            return getRes(result)
        }
    }
}

export default new Api()
