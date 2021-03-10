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
}

export const queryDefaultOptions: QueryOptions = {
    returnType: QueryReturnType.None,
    returnField: undefined,
    queryDebugLog: false,
    unusedToNull: [],
}

export type QueryParams = {
    [key: string]: any
}

export const prepareQuery = (queryName: string, queryString: string, params: QueryParams = {}, options: QueryOptions = {}): {text: string, values: any[]} => {
    let paramIndex = 0
    const values: any[] = []
    const unusedVariables: string[] = []

    const text = queryString.replace(/(?<!:):(\w+)/g, (text, variable) => {
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
        super({Client, ...options})
    }

    exec(queryObject: QueryConfig): Promise<QueryResultRow> {
        return super.query(queryObject)
    }
}
