import {AppProps, BaseApp} from '@apps/base'
import express from 'express'

class Auth extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async _init(expApp: express.Application): Promise<void> {}
}

export default new Auth({
    name: 'auth',
})
