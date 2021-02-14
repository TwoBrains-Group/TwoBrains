"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_handlebars_1 = __importDefault(require("express-handlebars"));
require("path");
const app_root_path_1 = __importDefault(require("app-root-path"));
class RenderEngine {
    constructor() {
        this.name = '.hbs';
        this.engine = express_handlebars_1.default.create({
            extname: this.name,
            defaultLayout: 'main',
            layoutsDir: app_root_path_1.default + '/views/layouts',
            partialsDir: app_root_path_1.default + '/views/partials',
            helpers: this._getHelpers()
        }).engine;
    }
    _getHelpers() {
        return {
            concat: (...args) => args.slice(0, -1).join(''),
            json: (...args) => {
                return args.map((str, i) => {
                    if (i < args.length - 1) {
                        return JSON.stringify(str || 'undefined', null, 2).trim();
                    }
                    else {
                        return '';
                    }
                }).join('\n').trim();
            },
            coalesce: (...args) => args.find(arg => arg)
        };
    }
}
exports.default = new RenderEngine();
//# sourceMappingURL=RenderEngine.js.map