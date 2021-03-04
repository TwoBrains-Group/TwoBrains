import express from 'express'
import Logger, {lf} from '@modules/logger'
import {MethodInitData, Method} from '@apps/base/Method'
import {getRes, Req} from '@apps/base/templates'
import {InvalidParams, MethodError} from "@apps/base/errors";
import Ajv, {DefinedError, JSONSchemaType} from "ajv";
import {formidable, Fields, Files} from 'formidable'

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

    async init(expApp: express.Application): Promise<void> {
        await this._init(expApp)
        await this.initRoutes(expApp)
    }

    protected async _init(expApp: express.Application): Promise<void> {}

    private async initRoutes(expApp: express.Application): Promise<void> {

        // FIXME: Dynamic require????!!!

        let api: ApiDir
        try {
            api = require(`@apps/${this.name}/api`).default
        } catch (error) {
            this.log.warn(`No api directory found for app ${this.name}`)
            return
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

            // Init methods
            for (const [methodName, method] of Object.entries(entities.methods)) {
                const schema = schemas[method.getName()]
                if (!schema) {
                    throw new Error(`Cannot find schema for method: ${this.name}/${method.getName()}`)
                }

                const validateSchema = ajv.compile(schema)

                const methodInitData: MethodInitData = {
                    appName: this.name,
                    schema,
                    queries,
                }

                await method.init(methodInitData)

                router.post(method.route, async (req: any, res, next) => {
                    if (method.formData) {
                        const form = formidable({
                            multiples: method.formDataMult,
                        })

                        form.parse(req, (err: Error, fields: Fields, files: Files) => {
                            if (err) {
                                next(err)
                                return
                            }


                        })
                    }

                    try {
                        const valid = await validateSchema(req.body)

                        if (!valid) {
                            console.log(`Invalid params: ${JSON.stringify(validateSchema.errors, null, 2)}`)
                            if (validateSchema.errors) {
                                throw new InvalidParams(...validateSchema.errors.map((el: DefinedError) => el.message as string))
                            } else {
                                throw new InvalidParams('Invalid params')
                            }
                        }

                        const requestObject: Req = {
                            app: this.name,
                            method: methodName,
                            params: req.body,
                        }

                        let result = await method.run(requestObject, req.user && req.user.userData)
                        result = getRes(result)

                        res.json(result)
                    } catch (error) {
                        if (!(error instanceof MethodError)) {
                            this.log.warn(`Errors thrown from method must be instances of 'MethodError'`)
                        }

                        this.log.error(`Got error on running method [${methodName}]: ${error.message}`)

                        res.json({
                            error: {
                                message: error.message
                            },
                        })
                    }
                })
            }

            const route = `${process.env.URI}/${version}/${this.routePrefix}`.replace(/\/{2,}/g, '/')
            expApp.use(route, router)
        }
    }
}
