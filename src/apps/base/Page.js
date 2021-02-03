const storage = require('@utils/storage')
const Route = require('@apps/base/Route')
const {MustBeOverridden} = require('@utils/errors')
const DB = require('@modules/db')

/**
 * Page is single unit for one route
 */
class Page extends Route {
    constructor(props = {}) {
        super(props)

        this.data = {}
        this.route = props.route || null
        this.appName = null
        this.useDB = props.useDB || false
    }

    async _init() {
        if (!this.route) {
            throw new Error(`Route is not specified for page ${this.getName()}`)
        }

        // Get data template
        this.data = storage.get()

        // Set page path for static data (css, js)
        this.data.info.path = this.getName()

        if (this.useDB) {
            this.db = await DB.getPool()
            await this.db.init()
        }
    }

    run() {
        throw new MustBeOverridden('run', this.getName())
    }

    /**
     * processHttp
     * @param {Object} req Request
     * @param {Object} res Response
     * @param {Function} next Next bypass function
     */
    processHttp(req, res, next) {
        let result = {}

        // FIXME: Circular
        // this.log.debug(`Get page message: ${JSON.stringify(req, null, 2)}`)

        try {
            result = this.run(req, res)
        } catch (error) {
            this.log.error()
        }

        let responseData = storage.get({
            ...this.data,
            page: result,
        })

        // this.log.debug(`Render page with data: ${responseData}`)

        res.render(this.data.info.path, responseData)
    }
}

module.exports = Page