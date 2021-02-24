import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config()

import server from './server'

(async () => {
    await server.init()
})()
