import {Client, QueryConfig, QueryResultRow} from 'pg'
import PgPool from 'pg-pool'
import {UnusedQueryParams} from './errors'

// const strict: boolean = process.env.ENV.toLowerCase() === 'prod' || true

export enum QueryReturnType {
    Row,
    Rows,
    None,
}

export type QueryOptions = {
    returnType?: QueryReturnType
    returnField?: string
    unusedToNull?: Array<string>
    queryDebugLog?: boolean
    args?: Record<string, any> // Must be passed if func-query was used
}

export const queryDefaultOptions: QueryOptions = {
    returnType: QueryReturnType.None,
    returnField: undefined,
    queryDebugLog: false,
    unusedToNull: [],
}

export type Query = string | ((args: Record<string, any>) => any)

export type Queries = Record<string, Query>

export type QueryParams = {
    [key: string]: any
}

export type PreparedQuery = {text: string, values: any[]}

export const prepareQuery = (queryName: string, queryString: string, params: QueryParams = {}, options: QueryOptions = {}): PreparedQuery => {
    const values: any[] = []
    let paramIndex = 0
    const unusedVariables: string[] = []

    let text = queryString.replace(/(?<!:):(\w+)/g, (text, variable) => {
        if (variable in params) {
            ++paramIndex
            values.push(params[variable])
            return `$${paramIndex}`
        } else if (options.unusedToNull?.includes(variable)) {
            return 'null'
        } else {
            unusedVariables.push(variable)
        }
        return text
    }).trim()

    const pattern = new RegExp(`\\/\\*\\s*(${Object.keys(params)}):\\s*\\*\\/`, 'gm')

    text = text.replace(pattern, '$1')

    if (unusedVariables.length) {
        throw new UnusedQueryParams(unusedVariables, queryName)
    }

    return {
        text,
        values,
    }
}

export class Pool extends PgPool<Client> {
    constructor(options: PgPool.Config<any>) {
        super({
            Client,
            ...options,
        })
    }

    exec(queryObject: QueryConfig): Promise<QueryResultRow> {
        return super.query(queryObject)
    }
}
