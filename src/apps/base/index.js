const fs = require('fs')
const config = require('@utils/config')

/**
 * BaseApp
 * Base for all applications
 */
class BaseApp {
    constructor() {
        this.name = '_base'
    }

    init(app) {
        this.initRoutes(app)
    }

    initRoutes(app) {
        const routesFilePath = `@apps/${this.name}/routes.js`

        const routes = require(routesFilePath)
        for (const [routeKey, value] of Object.entries(routes)) {
            const routeParts = routeKey.split(';')
            const httpMethod = routeParts[0].toLowerCase()
            const routePath = routeParts[1]

            if (!['post', 'get'].includes(httpMethod)) {
                throw new Error(`HTTP method of route ${routeKey} is invalid or no supported (only 'GET' and 'POST')`)
            }

            if (typeof value === 'function') {
                app[httpMethod](routePath, value)
            } else if (typeof value === 'string') {
                app[httpMethod](routePath, (req, res) => {
                    res.render(value)
                })
            }
        }
    }
}

module.exports = BaseApp