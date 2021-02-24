import express from 'express'
import DB from '@modules/db'
import Logger, {lf} from '@modules/logger'
import {AppData, Method} from '@apps/base/Method'
import {getRes, Req} from '@apps/base/templates'
import {MethodError} from "@apps/base/errors";

const mainLayout = 'layouts/main'

export type AppProps = {
    name?: string,
    routePrefix: string,
}

type ApiDir = Record<string, {queries: Record<string, string>, methods: Record<string, Method>}>

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

    async initRoutes(expApp: express.Application): Promise<void> {
        const appData: AppData = {
            appName: this.name
        }

        // FIXME: Dynamic require????!!!

        let api: ApiDir = null
        try {
            api = require(`@apps/${this.name}/api`).default
        } catch (error) {
            this.log.warn(`No api directory found for app ${this.name}`)
            return
        }

        const router = express.Router()
        for (const [version, entities] of Object.entries(api)) {
            appData.queries = new Map(Object.entries(entities.queries))

            if (!appData.queries) {
                this.log.warn(`No queries found for app ${this.name}`)
            }

            // Init methods
            for (const [methodName, method] of Object.entries(entities.methods)) {
                await method.init(appData)

                router.post(method.route, async (req, res) => {
                    try {
                        this.log.info(lf`Got request: ${req.body}, ${req.params}`)

                        const requestObject: Req = {
                            app: this.name,
                            method: methodName,
                            params: req.body,
                        }

                        let result = await method.run(requestObject)
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

        this.log.info(`Registered routes: ${JSON.stringify(router.stack.map((r: any) => r.route ? r.route.path : ''), null, 2)}`)
    }
}
