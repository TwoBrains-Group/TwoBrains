import express from 'express'
import 'path'
import appRootPath from 'app-root-path'
import renderEngine from './RenderEngine'
import apps from '@apps/index'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mws from './mws'

class Server {
    expApp: express.Application

    constructor() {
        this.expApp = express()
    }

    async init() {
        const expApp = this.expApp

        expApp.use('/static', express.static(appRootPath + '/static'))
        expApp.use(bodyParser.json())
        expApp.use(cookieParser())
        expApp.use(cors({
            origin: process.env.CORS_URL,
            optionsSuccessStatus: 200
        }))
        expApp.engine(renderEngine.name, renderEngine.engine)
        expApp.set('view engine', renderEngine.name)

        for (const mw of Object.values(mws)) {
            expApp.use(mw)
        }

        await this.initApps()

        const port = process.env.PORT!
        // const url = `http://localhost:${process.env.PORT!}`
        expApp.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    }

    async initApps() {
        for (const app of Object.values(apps)) {
            await app.init(this.expApp)
        }
    }
}
export default new Server()
