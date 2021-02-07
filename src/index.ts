import * as dotenv from 'dotenv'
require('module-alias/register')
import server from './server'

dotenv.config()
server.init()
