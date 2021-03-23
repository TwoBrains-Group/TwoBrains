import api from '@apps/base/api'
import express, {RequestHandler} from 'express'
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
        expApp.use(bodyParser.urlencoded({
            extended: false,
        }))
        expApp.use(bodyParser.json())
        expApp.use(cookieParser())
        expApp.use(cors({
            origin: process.env.CORS_URL!,
        }))

        this.log.info(`API listens on ${process.env.API_URI}`)
        this.expApp.post(process.env.API_URI!, async (req, res, next) => {
            // FIXME: Strange shit, error mw not working
            try {
                this.log.info(`Got request: ${JSON.stringify(req.body, null, 2)}`)

                const result = await api.callMethod(req, res, next)

                this.log.info(`Sent response: ${JSON.stringify(result, null, 2)}`)

                res.json(result)
            } catch (err) {
                this.log.error(`Got error: ${JSON.stringify(err, null, 2)}`)
                res.json({
                    error: {
                        name: err.name,
                        code: err.code,
                        message: err.message,
                        data: err.data,
                    },
                })
            }
        })

        await this.initApps()

        expApp.use(mws.error)
        expApp.use(mws.notSupported)

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
    }
}
export default new Server()
