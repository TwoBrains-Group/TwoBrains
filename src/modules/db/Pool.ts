import {Client, QueryResultBase} from 'pg'
import PgPool from 'pg-pool'
import {nanoid} from 'nanoid'

export class Pool extends PgPool<Client> {
    id: string

    constructor(options: PgPool.Config<any>) {
        super({Client, ...options});
        this.id = nanoid(16)
    }

    async exec(queryString: string, values: string[]): Promise<QueryResultBase> {
        return super.query(queryString, values);
    }
}
