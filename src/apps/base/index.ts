import express from 'express'
import {Page} from '@apps/base/Page'

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

    init(expApp: express.Application): void {
        // Conditions for app to run
        let startErrors = ''

        if (startErrors.length) {
            throw new Error(startErrors)
        }

        this.initPages(expApp)
        // TODO!: initMethods
    }

    initPages(expApp: express.Application): void {
        const pagesPath = `@apps/${this.name}/pages`

        const router = express.Router()
        // FIXME: Dynamic require????!!!
        const pages: Page = require(pagesPath)

        for (const [pageName, page] of Object.entries(pages)) {
            page.init(this.name)
            router.get(page.route, (req, res, next) => page.processHttp.call(page, req, res, next))
        }

        expApp.use(this.routePrefix, router)
    }
}
