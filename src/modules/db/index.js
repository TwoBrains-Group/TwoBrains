const {Pool} = require('pg')
const BaseModule = require('@modules/BaseModule')
const {nanoid} = require('nanoid')
const {dbConfig} = require('@utils/config')

class DB extends BaseModule {
    constructor(props = {}) {
        super(props)
    }

    async init() {

    }

    async getPool() {
        const pool = new Pool(dbConfig.connection)
        pool.tbData = {
            id: 'pgPool_' + nanoid(16)
        }
    }

    async query(queryString) {
        try {
            const client = await this.pool.connect()
            try {
                return await client.query(queryString)
            } finally {
                client.release()
            }
        } catch (error) {
            this.log.error()
        }
    }
}

module.exports = DB
