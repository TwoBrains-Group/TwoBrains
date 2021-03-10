import express from 'express'
import 'path'
import appRootPath from 'app-root-path'
import apps from '@apps/index'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
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
        expApp.use(bodyParser.urlencoded({ extended: false }))
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
                const router = await app.init(this.expApp)

                if (router) {
                    this.expApp.use(process.env.URI!, router)
                    // console.log('Use router:', router)
                }
            } catch (error) {
                this.log.error(`Failed to initialize app ${appName}`)
            }
        }
    }
}
export default new Server()
