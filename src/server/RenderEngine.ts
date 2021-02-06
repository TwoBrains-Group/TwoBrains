import ExpressHandlebars from 'express-handlebars'
import 'path'
import appRootPath from 'app-root-path'

type EngineFunc = (path: string, options: object, callback: (e: any, rendered: string) => void) => void

class RenderEngine {
    name: string
    engine: EngineFunc

    constructor() {
        this.name = '.hbs'
        this.engine = ExpressHandlebars.create({
            extname: this.name,
            defaultLayout: 'main',
            layoutsDir: appRootPath + '/views/layouts',
            partialsDir: appRootPath + '/views/partials',

            helpers: this._getHelpers()
        }).engine
    }

    _getHelpers() {
        return {
            concat: (...args: string[]) => args.slice(0, -1).join('')
        }
    }
}

export default new RenderEngine()
