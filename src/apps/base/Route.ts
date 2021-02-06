import express from 'express'
import {BaseApp} from '@apps/base'
import {MustBeOverridden} from '@utils/errors'
import Logger from '@modules/logger'

export default class Route {
    appName: string
    log: Logger

    constructor(props = {}) {
        this.appName = ''
        this.log = new Logger({
            owner: this.constructor.name.toLowerCase()
        })
    }

    async init(app: BaseApp) {
        this.appName = app.name
        await this._init()
    }

    /**
     * processHttp
     * @param {Object} req Request
     * @param {Object} res Response
     * @param {Function} next Next bypass function
     */
    processHttp(req: express.Request, res: express.Response, next: express.NextFunction) {
        throw new MustBeOverridden('processHttp', this.getName())
    }

    /**
     * getName
     */
    getName() {
        return this.appName + '/' + this.constructor.name.toLowerCase()
    }

    _init() {
        throw new MustBeOverridden('_init', 'Route class')
    }
}

module.exports = Route
