import express, {Router} from 'express'
import Logger from '@modules/logger'
import {MethodInitData, Method} from '@apps/base/Method'
import {getRes, Req} from '@apps/base/templates'
import {InvalidParams} from '@apps/base/errors'
import Ajv, {DefinedError, JSONSchemaType} from 'ajv'
import formidable, {Fields, Files} from 'formidable'

export type AppProps = {
    name?: string,
    routePrefix: string,
}

type ApiDir = Record<string, {
    queries: Record<string, string>,
    methods: Record<string, Method>,
    schemas: Record<string, JSONSchemaType<any>>
}>

/**
 * BaseApp
 * Base for all applications
 */
export class BaseApp {
    name: string
    routePrefix: string
    log: Logger

    constructor(props: AppProps) {
        this.name = props.name || this.constructor.name.toLowerCase()
        this.routePrefix = props.routePrefix
        this.log = new Logger({
            owner: this.name,
        })
    }

    async init(expApp: express.Application): Promise<Router | null> {
        await this._init(expApp)
        return await this.initRoutes()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected async _init(expApp: express.Application): Promise<void> {
    }

    private async initRoutes(): Promise<Router | null> {
        // FIXME: Dynamic require????!!!
        //  - yru shouting?

        let api: ApiDir
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            api = require(`@apps/${this.name}/api`).default
        } catch (error) {
            this.log.warn(`No api directory found for app ${this.name}`)
            return null
        }

        const ajv = new Ajv({
            allErrors: true,
        })

        const router = express.Router()
        for (const [version, entities] of Object.entries(api)) {
            let queries: Record<string, string> = {}
            let schemas: Record<string, JSONSchemaType<any>> = {}

            if (!entities.queries) {
                this.log.warn(`No queries found for app ${this.name}`)
            } else {
                queries = entities.queries
            }

            if (!entities.schemas) {
                this.log.warn(`No schemas found for app ${this.name}`)
            } else {
                schemas = entities.schemas
            }

            const fullRoutePrefix = `/${version}/${this.routePrefix}`

            // Init methods
            for (const [methodName, method] of Object.entries(entities.methods)) {
                const methodInitData: MethodInitData = {
                    appName: this.name,
                    queries,
                }

                const route = `${fullRoutePrefix}/${method.route}`.replace(/\/{2,}/g, '/')

                await method.init(methodInitData)

                // FIXME
                const schema = schemas[method.getName()] || {}
                if (!schema && !method.formData) {
                    throw new Error(`Cannot find schema for method: ${this.name}/${method.getName()}`)
                }

                const validateSchema = ajv.compile(schema)

                const reqBase = {
                    app: this.name,
                    method: methodName,
                }

                if (method.formData) {
                    router.post(route, async (req: any, res, next) => {
                        this.log.info(`(FormData) Got request to ${req.path}: ${JSON.stringify(req.body, null, 2)}`)

                        const form = new formidable.IncomingForm()

                        form.parse(req, async (err: Error, fields: Fields, files: Files) => {
                            if (err) {
                                return next(err)
                            }

                            let result = await method.runFormData({
                                ...reqBase,
                                formData: {
                                    fields,
                                    files,
                                },
                            }, req.user && req.user.userData)

                            result = getRes(result)

                            this.log.info(`Sent request: ${JSON.stringify(result, null, 2)}`)

                            res.json(result)
                        })
                    })
                } else {
                    router.post(route, async (req: any, res) => {
                        this.log.info(`Got request to ${req.path}: ${JSON.stringify(req.body, null, 2)}`)

                        const valid = await validateSchema(req.body)

                        if (!valid) {
                            console.log(`Invalid params: ${JSON.stringify(validateSchema.errors, null, 2)}`)
                            if (validateSchema.errors) {
                                throw new InvalidParams(validateSchema.errors.map((el: DefinedError) => el.message as string).join(','))
                            } else {
                                throw new InvalidParams('Invalid params')
                            }
                        }

                        const requestObject: Req = {
                            ...reqBase,
                            params: req.body,
                        }

                        let result = await method.run(requestObject, req.user && req.user.userData)
                        result = getRes(result)

                        this.log.info(`Sent request: ${JSON.stringify(result, null, 2)}`)

                        res.json(result)
                    })
                }
            }
        }

        return router
    }
}
