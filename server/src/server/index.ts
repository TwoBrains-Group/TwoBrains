import express from 'express'
import 'path'
import appRootPath from 'app-root-path'
import renderEngine from './RenderEngine'
import apps from '@apps/index'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

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
        expApp.use(cors())
        expApp.engine(renderEngine.name, renderEngine.engine)
        expApp.set('view engine', renderEngine.name)

        await this.initApps()

        expApp.listen(3000, () => {
            console.log('Server is listening on port 3000')
        })
    }

    async initApps() {
        for (const app of Object.values(apps)) {
            await app.init(this.expApp)
        }
    }
}
export default new Server()
