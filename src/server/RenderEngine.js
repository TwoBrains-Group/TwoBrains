const expressHandlebars = require('express-handlebars')
const path = require('path')
const appRootPath = require('app-root-path')

class RenderEngine {
    constructor() {
        this.name = '.hbs'
        this.engine = expressHandlebars.create({
            extname: this.name,
            defaultLayout: 'main',
            layoutsDir: appRootPath + '/views/layouts',
            partialsDir: appRootPath + '/views/partials',

            helpers: this._getHelpers()
        }).engine
    }

    _getHelpers() {
        return {
            concat: (...args) => args.slice(0, -1).join('')
        }
    }
}

module.exports = new RenderEngine()