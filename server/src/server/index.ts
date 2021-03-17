import api from '@apps/base/api'
import {getRes} from '@apps/base/templates'
import express from 'express'
import 'path'
import appRootPath from 'app-root-path'
import apps from '@apps/index'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import formidable, {Fields, Files} from 'formidable'
import mws from './mws'
import Logger from '@modules/logger'

class Server {
    expApp: express.Application
    log: Logger

    constructor() {
        this.expApp = express()

        this.log = new Logger({
            owner: 'server',
        })
    }

    async init() {
        const expApp = this.expApp

        expApp.use('/public', express.static(appRootPath + '/public'))
        expApp.use(bodyParser.urlencoded({
            extended: false,
        }))
        expApp.use(bodyParser.json())
        expApp.use(cookieParser())
        expApp.use(cors({
            origin: process.env.CORS_URL!,
        }))
        expApp.use(mws.jwt)

        await this.initApps()

        expApp.use(mws.error)

        const port = parseInt(process.env.PORT!)
        const server = expApp.listen(port, process.env.HOST!, () => {
            this.log.info('Server is listening on:', server.address())
        })
    }

    async initApps() {
        for (const [appName, app] of Object.entries(apps)) {
            try {
                await app.init(this.expApp)
            } catch (error) {
                this.log.error(`Failed to initialize app ${appName}, error: ${error}`)
            }
        }

        console.log('API SYSTEM:', JSON.stringify(api.system, null, 2))

        this.expApp.post(process.env.API_URI!, async (req, res, next) => {
            await api.callMethod(req, res, next)
        })
    }
}
export default new Server()
