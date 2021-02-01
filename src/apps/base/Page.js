const storage = require('@utils/storage')

/**
 * Page is single unit for one route
 */
class Page {
    constructor(props = {}) {
        this.method = props.method || null
        this.route = props.route || null
        this.appName = null

        // Data to join with storage
        this.data = storage.get()
    }

    init(app) {
        if (!this.route) {
            throw new Error('Page route is not specified')
        }
        if (!this.method || !['get', 'post'].includes(this.method)) {
            throw new Error(`Page method is not specified or is invalid (${this.method} given)`)
        }

        this.appName = app.name

        this.data.info.path = this.getPath()
    }

    routeFunc(req, res, next) {
        this.defaultFunc(req, res, next)
        // throw new Error(`routeFunc must be overridden (${this.appName}.[${this.method}]${this.route})`)
    }

    defaultFunc(req, res, next) {
        res.render(this.data.info.path, storage.get(this.data))
    }

    /**
     * getPath
     * Returns path to static data (html/js/css) as appName + pageName
     */
    getPath() {
        return this.appName + '/' + this.constructor.name.toLowerCase()
    }
}

module.exports = Page