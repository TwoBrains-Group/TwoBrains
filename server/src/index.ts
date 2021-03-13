import 'module-alias/register'
import '@utils/dotenv'
import server from './server'

(async () => {
    await server.init()
})()
