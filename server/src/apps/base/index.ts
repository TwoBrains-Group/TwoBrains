import express from 'express'
import DB from '@modules/db'
import Logger, {lf} from '@modules/logger'
import {AppData, Method} from '@apps/base/Method'
import {getRes} from '@apps/base/templates'

const mainLayout = 'layouts/main'

export type AppProps = {
    name?: string,
    routePrefix: string,
}

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

    initRoutes(expApp: express.Application): void {
        const appData: AppData = {
            appName: this.name
        }

        // Collect db queries
        const queriesPath = `@apps/${this.name}/queries.js`
        try {
            appData.queries = new Map(Object.entries(require(queriesPath).default))
        } catch (error) {
            this.log.debug(`No queries found for app [${this.name}]`)
        }

        // FIXME: Dynamic require????!!!
        const methodsPath = `@apps/${this.name}/methods`
        let methods: Map<string, Method>

        try {
            methods = require(methodsPath).default
        } catch (error) {
            this.log.warn(`No methods found for app ${this.name}`)
        }

        if (!methods) {
            return
        }

        this.log.debug(lf`${methods}`)

        const router = express.Router()
        for (const [methodName, method] of Object.entries(methods)) {
            this.log.info(`Initialize method ${methodName} with route '${this.name}/${method.route}'`)

            method.init(appData)

            router.get(method.route, async (req, res) => {
                let result = {}
                try {
                    result = await method.run(req)
                    result = getRes(result)

                    res.json(result)
                } catch (error) {
                    res.json({
                        error
                    })
                }
            })
        }

        expApp.use(this.routePrefix, router)
    }
}
