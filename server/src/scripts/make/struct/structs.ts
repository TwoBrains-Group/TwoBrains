const appIndex = `
import {AppProps, BaseApp} from '@apps/base'
import express from 'express'

class {{namePC}} extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async _init(expApp: express.Application): Promise<void> {}
}

export default new {{namePC}}({
    name: '{{name}}',
})
`

const versionIndex = `
import methods from './methods'
import queries from './queries'
import schemas from './schemas'

export default {
    methods,
    queries,
    schemas,
}
`

export default {
    appIndex,
    versionIndex,
}
