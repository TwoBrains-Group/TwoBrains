import express from 'express'
import {Page} from '@apps/base/Page'
import DB from '@modules/db'

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

    constructor(props: AppProps) {
        this.name = props.name || this.constructor.name.toLowerCase()
        this.routePrefix = props.routePrefix || '/'
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
        appData.queries = new Map(Object.entries(require(queriesPath).default))

        const pagesPath = `@apps/${this.name}/pages`

        const router = express.Router()
        // FIXME: Dynamic require????!!!
        const pages: Map<string, Page> = require(pagesPath)

        for (const [pageName, page] of Object.entries(pages)) {
            page.init(this.name, appData)
            router.get(page.route, async (req, res, next) => {
                if (page.useDB) {
                    page.db = await DB.getPool()
                }

                page.processHttp.call(page, req, res, next)

                if (page.useDB) {
                    await DB.close(page.db)
                }
            })
        }

        expApp.use(this.routePrefix, router)
    }
}
