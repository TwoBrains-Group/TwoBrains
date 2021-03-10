import {DBError} from '@modules/db/errors'
import {Pool} from '@modules/db'
import {prepareQuery, queryDefaultOptions, QueryOptions, QueryParams, QueryReturnType} from '@modules/db/pool'
import Logger from '@modules/logger'
import {nanoid} from 'nanoid'
import {format as formatSql} from 'sql-formatter'
import {config} from '@utils/config'
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
        options = {...queryDefaultOptions, ...options}

        const {returnType, returnField, queryDebugLog} = options

        try {
            await this.pool.exec({text: 'SET search_path TO \'main\';'})
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

            if (!rows && returnType !== QueryReturnType.None) {
                this.log.error('Got no rows when expected')
                return null
            }

            if (returnType === QueryReturnType.Row) {
                if (!rows.length) {
                    return null
                }

                return returnField ? rows[0][returnField] : rows[0]
            }

            return rows
        } catch (error) {
            if (!(error instanceof DBError)) {
                this.log.warn('All errors thrown from DB module must be instances DBError')
            }

            this.log.error(`[DB Error] ${error}`)

            if (error.fatal) {
                throw error.hide()
            }
        }
    }
}

export default DBInstance
