import {MustBeOverridden} from '@utils/errors'
import Logger, {lf} from '@modules/logger'
import {default as DB, Pool} from '@modules/db'
import {QueryResultBase} from 'pg'
import {prepareQuery, queryDefaultOptions, QueryOptions, QueryParams, QueryReturnType} from '@modules/db/Pool'
import {Req, Res, MethodRes} from '@apps/base/templates'
import {DBError} from '@modules/db/errors'
import {JSONSchemaType} from 'ajv'
import {format as formatSql} from 'sql-formatter'

export type MethodProps = {
    useDB?: boolean,
    route: string
}

export type MethodInitData = {
    queries?: Record<string, string>
    appName: string,
    schema: JSONSchemaType<any>
}

export abstract class Method {
    appName: string
    log: Logger
    db?: Pool
    useDB: boolean
    route: string
    private queries?: Record<string, string>
    private schema: JSONSchemaType<any>

    constructor(props: MethodProps) {
        this.appName = ''
        this.route = `/${props.route}`.replace(/\/{2,}/g, '/')
        this.useDB = props.useDB || true
    }

    async init(appData: MethodInitData) {
        this.appName = appData.appName
        this.queries = appData.queries

        this.log = new Logger({
            owner: this.getPath()
        })

        this.db = await DB.getPool()

        this.schema = appData.schema

        await this._init()

        this.log.info(`Route ${this.getPath()} inited`)
    }

    protected _init() {}

    async validateReq(req: Req): Promise<void | never> {

    }

    async run(req: Req, user?: any): Promise<MethodRes> {
        throw new MustBeOverridden('run', `method ${this.getPath()}`)
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
    getPath() {
        return this.appName + '/' + this.getName()
    }

    getName() {
        return this.constructor.name[0].toLowerCase() + this.constructor.name.slice(1)
    }

    async query(queryName: string, params: QueryParams = {}, options: QueryOptions = {}): Promise<any> {
        if (!this.useDB) {
            throw new Error(`Attempt to use DB in route with disabled DB (${this.getPath()})`)
        }
        if (!this.db) {
            throw new Error(`Failed to initialize DB on request to route ${this.getPath()}`)
        }

        options = {...queryDefaultOptions, ...options}

        const query = this.queries![queryName]
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getPath()}`)
            return
        }

        const {returnType, returnField, queryDebugLog} = options

        try {
            await this.db.exec({text: 'SET search_path TO \'main\';'})
            const preparedQuery = prepareQuery(query, params, options)

            if (queryDebugLog) {
                const beautifulSql = formatSql(preparedQuery.text, {
                    language: 'postgresql',
                    indent: '    ',
                    uppercase: true,
                })
                this.log.debug(`(query debug log) ${queryName}:\n${beautifulSql}\nParams: ${JSON.stringify(params, null, 2)}`)
            }

            const result = await this.db.exec(preparedQuery)
            const {rows} = result

            this.log.debug(`DB result: ${JSON.stringify(rows, null, 2)}`)

            if (!rows && returnType !== QueryReturnType.None) {
                throw new DBError(`Got no rows when expected`)
            }

            if (returnType === QueryReturnType.Row) {
                if (!rows.length) {
                    return null
                }
                const result = rows[0]
                if (!rows[0]) {
                    return null
                }

                if (returnField) {
                    return rows[0][returnField]
                }
                return rows[0]

                // return returnField ? rows[0][returnField] : rows[0]
            }

            return rows
        } catch (error) {
            if (!(error instanceof DBError)) {
                this.log.warn(`All errors thrown from DB module must be instances DBError`)
            }

            this.log.error(`[DB Error] ${error}`)

            if (error.fatal) {
                throw error.hide()
            }
        }
    }
}

export {Req, Res, MethodRes} from '@apps/base/templates'
