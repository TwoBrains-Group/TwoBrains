const express = require('express')
const path = require('path')
const appRootPath = require('app-root-path')
const config = require('@utils/config')
const renderEngine = require('./RenderEngine')

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
        if (!Array.isArray(config.apps)) {
            throw new Error('Config must contain \'apps\' array')
        }

        for (const appName of config.apps) {
            const app = require(`@apps/${appName}`)
            if (app) {
                app.init(this.expApp)
            } else {
                console.log(`App ${app} does not exist`)
            }
        }
    }
}

module.exports = new Server