const fs = require('fs')
const config = require('@utils/config')
const storage = require('@utils/storage')
const express = require('express')

/**
 * BaseApp
 * Base for all applications
 */
class BaseApp {
    constructor(props) {
        this.name = props.name || this.constructor.name.toLowerCase()
        this.routePrefix = props.routePrefix || '/'
    }

    init(app) {
        // Conditions for app to run
        let startErrors = ''
        if (typeof this.name !== 'string') {
            startErrors += 'App name must be a string\n'
        }
        if (typeof this.routePrefix !== 'string') {
            startErrors += 'appPrefix must be a string\n'
        }

        if (startErrors.length) {
            throw new Error(startErrors)
        }

        this.initRoutes(app)
    }

    initRoutes(app) {
        const pagesPath = `@apps/${this.name}/pages`

        const router = express.Router()
        const pages = require(pagesPath)

        for (const [pageName, page] of Object.entries(pages)) {
            page.init(this)
            router[page.method](page.route, (req, res, next) => page.routeFunc.call(page, req, res, next))
        }

        app.use(this.routePrefix, router)
    }
}

module.exports = BaseApp