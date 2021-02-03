const express = require('express')
const path = require('path')
const appRootPath = require('app-root-path')
const config = require('@utils/config')
const renderEngine = require('./RenderEngine')
const apps = require('@apps')

class Server {
    constructor() {
        this.expApp = express()
    }

    init() {
        const expApp = this.expApp

        expApp.use('/static', express.static(appRootPath + '/static'))
        expApp.engine(renderEngine.name, renderEngine.engine)
        expApp.set('view engine', renderEngine.name)

        this.initApps()

        expApp.listen(3000, () => {
            console.log('Server is listening on port 3000')
        })
    }

    initApps() {
        for (const app of Object.values(apps)) {
            app.init(this.expApp)
        }
    }
}

module.exports = new Server