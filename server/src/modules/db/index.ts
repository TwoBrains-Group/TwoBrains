import {BaseModule, ModuleProps} from '@modules/BaseModule'
import {Pool} from './Pool'
import {config} from '@utils/config'

// FIXME: This is kind of... stupid
process.env.PG_OPTIONS="-c search_path=main"

const {db: {connection}} = config

export {Pool} from './Pool'

class DB extends BaseModule {
    constructor(props: ModuleProps = {}) {
        super(props)
    }

    async getPool(): Promise<Pool> {
        const instance = new Pool(connection)

        const {host, db, port} = connection
        const dbUrl = `${host}:${port}/${db}`

        instance.on('connect', async client => {
            // FIXME: Move to config
            this.log.debug(`Connection to ${dbUrl} established: ${this.getInstanceInfo(instance)}`)
        })

        instance.on('error', async error => {
            this.log.error(`Pool ${instance.id} error: ${error}`)
        })

        return instance
    }

    getInstanceInfo(instance: Pool): string {
        return `\n\tPool id:${instance.id}\n\tTotal connections: ${instance.totalCount}\n\tWaiting count: ${instance.waitingCount}`
    }

    async close(instance: Pool): Promise<void> {
        await instance.end();
    }
}

export default new DB()
