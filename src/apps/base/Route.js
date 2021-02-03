const Logger = require('@modules/logger')
const {MustBeOverridden} = require('@utils/errors')

class Route {
    constructor(props = {}) {
        this.log = new Logger({
            owner: this.constructor.name.toLowerCase()
        })
    }

    async init(app) {
        this.appName = app.name
        await this._init()
    }

    /**
     * processHttp
     * @param {Object} req Request
     * @param {Object} res Response
     * @param {Function} next Next bypass function
     */
    processHttp(req, res, next) {
        throw new MustBeOverridden('processHttp', this.getName())
    }

    /**
     * getName
     */
    getName() {
        return this.appName + '/' + this.constructor.name.toLowerCase()
    }

    async _init() {
        throw new MustBeOverridden('_init', 'Route class')
    }
}

module.exports = Route
