import api from '@apps/base/api'
import express from 'express'
import Logger from '@modules/logger'

export type AppProps = {
    name: string,
}

/**
 * BaseApp
 * Base for all applications
 */
export class BaseApp {
    name: string
    log: Logger

    constructor(props: AppProps) {
        this.name = props.name || this.constructor.name.toLowerCase()
        this.log = new Logger({
            owner: this.name,
        })
    }

    async init(expApp: express.Application): Promise<void> {
        await this._init(expApp)
        await api.init(this.name)

        this.log.info('App inited')
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected async _init(expApp: express.Application): Promise<void> {}
}
