import {InvalidParams} from '@apps/base/errors'
import {Method, MethodInitData, Req} from '@apps/base/Method'
import {getRes} from '@apps/base/templates'
import {Query} from '@modules/db/pool'
import Logger from '@modules/logger'
import {JSONSchemaType} from 'ajv'
import {NextFunction, Response} from 'express'
import formidable, {Fields, Files} from 'formidable'
import ajv from '@modules/ajv'

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

                const validateSchema = ajv.compile(schema)

                const methodInitData: MethodInitData = {
                    appName,
                    queries,
                    validateSchema,
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

    async callMethod(req: any, res: Response, next: NextFunction) {
        const reqObj: Req = req.body

        this.log.info(`Got request: ${JSON.stringify(reqObj, null, 2)}`)

        // TODO: Validate base

        const method = this.system[reqObj.app][`v${reqObj.v}`].methods[reqObj.method]

        if (method.formData) {
            const form = new formidable.IncomingForm()

            form.parse(req.formData, async (err: Error, fields: Fields, files: Files) => {
                if (err) {
                    return next(err)
                }

                let result = await method.runFormData({
                    ...req.body,
                    formData: {
                        fields,
                        files,
                    },
                }, req.user && req.user.userData)

                result = getRes(result)

                this.log.info(`Sent response: ${JSON.stringify(result, null, 2)}`)

                res.json(result)
            })
        } else {
            const valid = await method.validateSchema(reqObj.params)

            if (!valid) {
                if (method.validateSchema.errors) {
                    return next(new InvalidParams(method.validateSchema.errors))
                } else {
                    throw new InvalidParams()
                }
            }

            let result = await method.run(req.body, req.user && req.user.userData)
            result = getRes(result)

            this.log.info(`Sent response: ${JSON.stringify(result, null, 2)}`)

            res.json(result)
        }
    }
}

export default new Api()
