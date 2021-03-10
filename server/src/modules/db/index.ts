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

    async close(instance: Pool): Promise<void> {
        await instance.end()
    }
}

export default new DB()
