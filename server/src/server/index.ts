import express from 'express'
import 'path'
import appRootPath from 'app-root-path'
import renderEngine from './RenderEngine'
import * as apps from '@apps/index'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

class Server {
    expApp: express.Application

    constructor() {
        this.expApp = express()
    }

    init() {
        const expApp = this.expApp

        expApp.use('/static', express.static(appRootPath + '/static'))
        expApp.use(bodyParser.json())
        expApp.use(cookieParser())
        expApp.engine(renderEngine.name, renderEngine.engine)
        expApp.set('view engine', renderEngine.name)

        this.initApps()

        expApp.listen(3000, () => {
            console.log('Server is listening on port 3000')
        })
    }

    initApps() {
        for (const app of Object.values(apps)) {
            app.default.init(this.expApp)
        }
    }
}
export default new Server()
