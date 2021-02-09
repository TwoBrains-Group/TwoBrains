import express from 'express'
import {MustBeOverridden} from '@utils/errors'
import Logger from '@modules/logger'
import {Pool} from '@modules/db'
import {QueryResultBase} from "pg";
import {prepareQuery, queryDefaultOptions, QueryOptions, QueryParams, QueryReturnType} from "@modules/db/Pool";

export type RouteProps = {
    useDB?: boolean
}

export class Route {
    appName: string
    log: Logger
    db?: Pool
    useDB: boolean
    private queries?: Map<string, string>

    constructor(props: RouteProps) {
        this.appName = ''
        this.log = new Logger({
            owner: this.constructor.name.toLowerCase()
        })

        this.useDB = props.useDB || true
    }

    async init(appName: string, appData: {queries?: Map<string, string>}) {
        this.appName = appName
        this.queries = appData.queries
        await this._init()

        this.log.info(`Route ${this.getName()} inited`)
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

    async query(queryName: string, params: QueryParams = {}, options: QueryOptions = {}): Promise<QueryResultBase> {
        if (!this.useDB) {
            throw new Error(`Attempt to use DB in route with disabled DB (${this.getName()})`)
        }
        if (!this.db) {
            throw new Error(`Failed to initialize DB on request to route ${this.getName()}`)
        }

        const query = this.queries.get(queryName)
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getName()}`)
        }

        try {
            const preparedQuery = prepareQuery(query, params)
            const result = await this.db.exec(preparedQuery)

            options = {...queryDefaultOptions, ...options}

            if (options.returnType === QueryReturnType.ROW) {
                return options.returnField ? result.rows[0][options.returnField] : result.rows[0]
            }

            return result.rows
        } catch (error) {
            this.log.error(`DB Error ${error}`)
        }
    }
}
