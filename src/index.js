require('dotenv').config()
require('module-alias/register')

const server = require('./server')
server.init()