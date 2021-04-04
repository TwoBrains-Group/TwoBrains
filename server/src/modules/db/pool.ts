import {Client, QueryConfig, QueryResultRow} from 'pg'
import PgPool from 'pg-pool'
import {BaseError, NotFoundError} from '@apps/base/errors'
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
    check?: boolean
    checkError?: BaseError
}

export const queryDefaultOptions: QueryOptions = {
    returnType: QueryReturnType.None,
    returnField: undefined,
    queryDebugLog: false,
    unusedToNull: [],
    check: false,
    checkError: new NotFoundError(),
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
    const unusedQueryParams: string[] = []

    let text = queryString
    for (const param of Object.keys(params)) {
        const pattern = new RegExp(`/\\*\\s*${param}:([^*]*)\\*/`, 'gm')
        text = text.replace(pattern, '$1')
    }

    text = text.replace(/\/\*[\s\S]*?\*\//gms, '')

    text = text.replace(/(?<!:):(\w+)/g, (text, variable) => {
        if (variable in params) {
            ++paramIndex
            values.push(params[variable])
            return `$${paramIndex}`
        } else if (options.unusedToNull?.includes(variable)) {
            return 'null'
        } else {
            unusedQueryParams.push(variable)
        }
        return text
    }).trim()

    if (unusedQueryParams.length) {
        throw new UnusedQueryParams(unusedQueryParams, queryName)
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
