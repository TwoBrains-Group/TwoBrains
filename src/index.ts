import * as dotenv from 'dotenv'
require('module-alias/register')
import server from '@server/index'

dotenv.config()
server.init()