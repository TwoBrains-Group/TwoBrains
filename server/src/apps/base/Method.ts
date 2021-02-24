import {MustBeOverridden} from '@utils/errors'
import Logger, {lf} from '@modules/logger'
import {default as DB, Pool} from '@modules/db'
import {QueryResultBase} from 'pg'
import {prepareQuery, queryDefaultOptions, QueryOptions, QueryParams, QueryReturnType} from '@modules/db/Pool'
import {Req, Res} from '@apps/base/templates'
import {DBError} from "@modules/db/errors";

export type MethodProps = {
    useDB?: boolean,
    route: string
}

export type AppData = {
    queries?: Map<string, string>
    appName: string
}

export abstract class Method {
    appName: string
    log: Logger
    db?: Pool
    useDB: boolean
    route: string
    private queries?: Map<string, string>

    protected constructor(props: MethodProps) {
        this.appName = ''
        this.log = new Logger({
            owner: this.getName()
        })
        this.route = `/${props.route}`.replace(/\/{2,}/g, '/')

        this.useDB = props.useDB || true
    }

    async init(appData: AppData) {
        this.appName = appData.appName
        this.queries = appData.queries

        this.db = await DB.getPool()

        await this._init()

        this.log.info(`Route ${this.getName()} inited`)
    }

    _init() {
        // throw new MustBeOverridden('_init', `method ${this.getName()}`)
    }

    async run(req: Req): Promise<Res> {
        throw new MustBeOverridden('run', `method ${this.getName()}`)
    }

    // /**
    //  * processHttp
    //  * @param {Object} req Request
    //  * @param {Object} res Response
    //  * @param {Function} next Next bypass function
    //  */
    // processHttp(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     throw new MustBeOverridden('processHttp', this.getName())
    // }

    /**
     * getName
     */
    getName() {
        return this.appName + '/' + this.constructor.name.toLowerCase()
    }

    async query(queryName: string, params: QueryParams = {}, options: QueryOptions = {}): Promise<QueryResultBase | any> {
        if (!this.useDB) {
            throw new Error(`Attempt to use DB in route with disabled DB (${this.getName()})`)
        }
        if (!this.db) {
            throw new Error(`Failed to initialize DB on request to route ${this.getName()}`)
        }

        const {returnType, returnField} = options

        const query = this.queries.get(queryName)
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getName()}`)
        }

        try {
            await this.db.exec({text: 'SET search_path TO \'main\';'})
            const preparedQuery = prepareQuery(query, params)
            const result = await this.db.exec(preparedQuery)
            const {rows} = result

            this.log.debug(lf`DB result: ${result.rows[0]}`)

            options = {...queryDefaultOptions, ...options}

            if (!rows && returnType !== QueryReturnType.None) {
                throw new DBError(`Got no rows when expected`)
            }

            if (options.returnType === QueryReturnType.Row) {
                if (!rows.length) {
                    return null
                }
                return options.returnField ? rows[0][returnField] : rows[0]
            }

            return rows
        } catch (error) {
            this.log.error(`[DB Error] ${error}`)
        }
    }
}

export {Req, Res} from '@apps/base/templates'
