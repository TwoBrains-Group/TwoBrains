import {Client, QueryConfig, QueryResultRow, types} from 'pg'
import PgPool from 'pg-pool'
import {nanoid} from 'nanoid'
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

export const prepareQuery = (queryString: string, params: QueryParams = {}, options: QueryOptions = {}) => {
    let paramIndex: number = 0
    const values: any[] = []
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

    if (unusedVariables.length) {
        throw new UnusedQueryParams(unusedVariables)
    }

    return {
        text,
        values,
    }
}

export class Pool extends PgPool<Client> {
    id: string

    constructor(options: PgPool.Config<any>) {
        super({Client, ...options});
        this.id = nanoid(16)
    }

    exec(queryObject: QueryConfig): Promise<QueryResultRow> {
        return super.query(queryObject)
    }
}
