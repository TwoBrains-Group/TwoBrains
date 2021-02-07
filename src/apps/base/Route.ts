import express from 'express'
import {MustBeOverridden} from '@utils/errors'
import Logger from '@modules/logger'
import {Pool} from '@modules/db'

export type RouteProps = {
    useDB?: boolean
}

export class Route {
    appName: string
    log: Logger
    db?: Pool
    useDB: boolean

    constructor(props: RouteProps) {
        this.appName = ''
        this.log = new Logger({
            owner: this.constructor.name.toLowerCase()
        })

        this.useDB = props.useDB || true
    }

    async init(appName: string) {
        this.appName = appName
        await this._init()
    }

    _init() {
        throw new MustBeOverridden('_init', 'Route class')
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
}
