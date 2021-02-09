import express from 'express'

import {Page, PageProps} from '@apps/base/Page'
import {storage, StorageData} from '@utils/storage'
import {QueryReturnType} from "@modules/db/Pool";

class Home extends Page {
    constructor(props: PageProps) {
        super(props)
    }

    async run(req: express.Request, res: express.Response): Promise<StorageData> {
        const result = await this.query('kek', {param: 'kek'}, {
            returnType: QueryReturnType.ROW,
            returnField: 'kek'
        })

        this.log.info(`result: ${JSON.stringify(result, null, 2)}`)

        return storage.get({
            page: {
                kek: result,
            },
        })
    }
}

export default new Home({
    route: '/',
})
