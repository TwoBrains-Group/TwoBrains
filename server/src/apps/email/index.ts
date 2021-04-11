import {AppProps, BaseApp} from '@apps/base'
import express from 'express'

class Email extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    async _init(expApp: express.Application): Promise<void> {}
}

export default new Email({
    name: 'email',
})
