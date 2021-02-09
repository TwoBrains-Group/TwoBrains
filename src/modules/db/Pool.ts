import {Client, QueryConfig, QueryResultRow} from 'pg'
import PgPool from 'pg-pool'
import {nanoid} from 'nanoid'

export enum QueryReturnType {
    ROW,
    ROWS,
}

export type QueryOptions = {
    returnType?: QueryReturnType,
    returnField?: string
}

export const queryDefaultOptions: QueryOptions = {
    returnType: QueryReturnType.ROWS,
}

export type QueryParams = {
    [key: string]: any
}

export const prepareQuery = (queryString: string, params: QueryParams = {}) => {
    let paramIndex: number = 0
    const values: any[] = []
    const text = queryString.replace(/:(\w+)/g, (text, variable) => {
        if (variable in params) {
            ++paramIndex
            values.push(params[variable])
            return `$${paramIndex}`
        }
        return text
    }).trim()

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
