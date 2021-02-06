import express from 'express'

import {storage, StorageData} from '@utils/storage'
import Route from '@apps/base/Route'
import {MustBeOverridden} from '@utils/errors'
import {Pool} from '@modules/db'
import DB from '@modules/db'

export type PageProps = {
    route: string,
    useDB?: boolean
}

/**
 * Page is single unit for one route
 */
export class Page extends Route {
    data: StorageData
    route: string
    useDB: boolean
    db: Pool

    constructor(props: PageProps) {
        super(props)

        this.route = props.route
        this.useDB = props.useDB || true
    }

    _init(): void {
        if (!this.route) {
            throw new Error(`Route is not specified for page ${super.getName()}`)
        }

        // Get data template
        this.data = storage.get()

        // Set page path for static data (css, js)
        this.data.info.path = super.getName()
    }

    async run(req: express.Request, res: express.Response, next?: express.NextFunction): Promise<StorageData> {
        throw new MustBeOverridden('run', super.getName())
    }

    /**
     * processHttp
     * @param {Object} req Request
     * @param {Object} res Response
     * @param {Function} next Next bypass function
     */
    async processHttp(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = {}

        // FIXME: Circular
        // this.log.debug(`Get page message: ${JSON.stringify(req, null, 2)}`)

        try {
            if (this.useDB) {
                this.db = await DB.getPool()
            }

            result = this.run(req, res)

            if (this.useDB) {
                await DB.close(this.db)
            }
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
