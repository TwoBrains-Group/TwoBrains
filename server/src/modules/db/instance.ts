import {DBError} from '@modules/db/errors'
import {Pool} from '@modules/db'
import {prepareQuery, queryDefaultOptions, QueryOptions, QueryParams, QueryReturnType} from '@modules/db/pool'
import Logger from '@modules/logger'
import {nanoid} from 'nanoid'
import {format as formatSql} from 'sql-formatter'
import {config} from '@utils/config'
import {InternalError} from '@apps/base/errors'

const {db: {connection}} = config

class DBInstance {
    pool: Pool
    log: Logger
    id: string

    init(): void {
        this.id = nanoid(16)
        this.log = new Logger({
            owner: `DBInstance_${this.id}`,
        })

        this.pool = new Pool(connection)

        const {host, database, port} = connection
        const dbUrl = `${host}:${port}/${database}`

        this.pool.on('connect', async () => {
            // FIXME: Move to config
            this.log.debug(`Connection to ${dbUrl} established: ${this.getInfo()}`)
        })

        this.pool.on('error', async error => {
            this.log.error(`Pool ${this.id} error: ${error}`)
        })
    }

    async end(): Promise<void> {
        await this.pool.end()
    }

    getInfo(): string {
        return `\n\tPool id:${this.id}\n\tTotal connections: ${this.pool.totalCount}\n\tWaiting count: ${this.pool.waitingCount}`
    }

    async query(queryName: string, query: string, params: QueryParams = {}, options: QueryOptions = {}): Promise<any> {
        options = {
            ...queryDefaultOptions,
            ...options,
        }

        const {returnType, returnField, queryDebugLog, check} = options
        let {checkError} = options
        if (!(checkError instanceof Error)) {
            checkError = new InternalError(checkError)
        }

        if (queryDebugLog) {
            this.log.debug(`(query debug log) ${queryName}: Full params: ${JSON.stringify(params, null, 2)}`)
        }

        for (const paramName of Object.keys(params)) {
            if (params[paramName] === undefined) {
                delete params[paramName]
            }
        }

        if (queryDebugLog) {
            this.log.debug(`(query debug log) ${queryName}: Clean params: ${JSON.stringify(params, null, 2)}`)
        }

        try {
            await this.pool.exec({
                text: 'SET search_path TO \'main\';',
            })
            const preparedQuery = prepareQuery(queryName, query, params, options)

            if (queryDebugLog) {
                const beautifulSql = formatSql(preparedQuery.text, {
                    language: 'postgresql',
                    indent: '    ',
                    uppercase: true,
                })
                this.log.debug(`(query debug log) ${queryName}:\n${beautifulSql}\nValues: ${JSON.stringify(preparedQuery.values, null, 2)}`)
            }

            const result = await this.pool.exec(preparedQuery)
            const {rows} = result

            this.log.debug(`DB result: ${JSON.stringify(rows, null, 2)}`)

            if (returnType === QueryReturnType.Row) {
                if (!rows.length) {
                    if (check) {
                        throw checkError
                    }
                }

                return returnField ? rows[0][returnField] : rows[0]
            }

            if (check) {
                throw checkError
            }

            return rows
        } catch (error) {
            if (!(error instanceof DBError)) {
                this.log.warn('All errors thrown from DB module must be instances DBError')
            }

            this.log.error(`[DB Error] (${queryName}) ${error}`)

            if (error.fatal) {
                throw error.hide()
            }
        }
    }
}

export default DBInstance
