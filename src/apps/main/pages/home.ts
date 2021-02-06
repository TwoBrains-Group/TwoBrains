import express from 'express'

import {Page, PageProps} from '@apps/base/Page'
import {StorageData, storage} from '@utils/storage'

class Home extends Page {
    constructor(props: PageProps) {
        super(props)
    }

    async run(req: express.Request, res: express.Response): Promise<StorageData> {
        return storage.get({
            page: {
                kek: 'lol',
            },
        })
    }
}

export default new Home({
    route: '/',
})
