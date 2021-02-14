import express from 'express'
import {Page} from '@apps/base/Page'
import DB from '@modules/db'
import Logger, {lf} from "@modules/logger";

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
        // Conditions for app to run
        let startErrors = ''

        if (startErrors.length) {
            throw new Error(startErrors)
        }

        await this.initRoutes(expApp)
    }

    initRoutes(expApp: express.Application): void {
        const appData: {
            queries?: Map<string, string>
        } = {}

        // Collect db queries
        const queriesPath = `@apps/${this.name}/queries.js`
        try {
            appData.queries = new Map(Object.entries(require(queriesPath).default))
        } catch (error) {
            this.log.debug(`No queries found for app [${this.name}]`)
        }

        // FIXME: Dynamic require????!!!
        const pagesPath = `@apps/${this.name}/pages`
        const pages: Map<string, Page> = require(pagesPath)

        const router = express.Router()
        for (const [pageName, {default: page}] of Object.entries(pages)) {
            page.init(this.name, appData)
            router.get(page.route, async (req, res, next) => {
                if (page.useDB) {
                    page.db = await DB.getPool()
                }

                this.log.info(`Get request to route: ${(this.routePrefix + page.route).replace(/\/{2,}/g, '/')}, load page [${pageName}]`)
                await page.processHttp.call(page, req, res, next)

                if (page.useDB) {
                    await DB.close(page.db)
                }
            })
        }

        expApp.use(this.routePrefix, router)
    }
}
