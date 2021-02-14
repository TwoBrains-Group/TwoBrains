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
            concat: (...args: string[]) => args.slice(0, -1).join(''),
            json: (...args: string[]) => {
                return args.map((str, i) => {
                    if (i < args.length - 1) {
                        return JSON.stringify(str || 'undefined', null, 2).trim()
                    } else {
                        return ''
                    }
                }).join('\n').trim()
            },
            coalesce: (...args: any[]) => args.find(arg => arg)
        }
    }
}

export default new RenderEngine()
