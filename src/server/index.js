const express = require('express')
const path = require('path')
const config = require('@utils/config')
const expressHandlebars = require('express-handlebars')

class Server {
    constructor() {
        this.app = express()
    }

    init() {
        const app = this.app

        app.use('/static', express.static(path.join(__dirname, 'public')))
        app.engine('.hbs', expressHandlebars({extname: '.hbs'}))
        app.set('view engine', '.hbs')

        this.initApps()

        app.listen(3000, () => {
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
                app.init(this.app)
            } else {
                console.log(`App ${app} does not exist`)
            }
        }
    }
}

module.exports = new Server