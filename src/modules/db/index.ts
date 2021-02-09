import {BaseModule, ModuleProps} from '@modules/BaseModule'
import {Pool} from './Pool'
import {config} from '@utils/config'

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
            this.log.debug(`Connection to ${dbUrl} established:${this.getInstanceInfo(instance)}`)
        })

        instance.on('error', async error => {
            this.log.error(`Connection to ${dbUrl} closed`)
        })

        return instance
    }

    getInstanceInfo(instance: Pool): string {
        return `\tPool id:${instance.id}\tTotal connections: ${instance.totalCount}\tWaiting count: ${instance.waitingCount}`
    }

    async close(instance: Pool): Promise<void> {
        await instance.end();
    }
}

export default new DB()
