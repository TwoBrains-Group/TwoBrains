import express from 'express'
import {PageData, storage} from '@utils/storage'
import {Route, RouteProps} from '@apps/base/Route'
import {MustBeOverridden} from '@utils/errors'
import {lf} from "@modules/logger";

export type PageProps = RouteProps & {
    route: string
}

export type Request = express.Request
export type Response = express.Response
export type NextFunction = express.NextFunction

/**
 * Page is single unit for one route
 */
export abstract class Page extends Route {
    route: string

    protected constructor(props: PageProps) {
        super(props)

        this.route = props.route.replace(/\/{2,}/g, '/')
    }

    _init(): void {
    }

    async run(req: express.Request, res: express.Response, next?: express.NextFunction): Promise<PageData> {
        throw new MustBeOverridden('run', super.getName())
    }

    /**
     * processHttp
     * @param {Object} req Request
     * @param {Object} res Response
     * @param {Function} next Next bypass function
     */
    async processHttp(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const pageData = await this.run(req, res)

            const data = storage.get({
                page: pageData,
                info: {
                    path: this.getName(),
                },
            })

            this.log.info(lf`Render page with data: ${data}`)

            // TODO: Move 'pages' to constant
            res.render(`apps/${this.getName()}`, data)
        } catch (error) {
            this.log.error(`Error on processing page ${this.getName()}: ${error}`)
        }
    }
}
