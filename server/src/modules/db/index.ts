import {BaseModule} from '@modules/BaseModule'
import {Pool} from './pool'
import DBInstance from '@modules/db/instance'

// FIXME: This is kind of... stupid
process.env.PG_OPTIONS='-c search_path=main'

export {Pool} from './pool'

class DB extends BaseModule {
    async getInstance(): Promise<DBInstance> {
        const instance = new DBInstance()
        await instance.init()
        return instance
    }

    async close(instance: DBInstance): Promise<void> {
        await instance.pool.end()
    }
}

export default new DB()
