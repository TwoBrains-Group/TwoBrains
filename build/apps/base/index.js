"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApp = void 0;
const express_1 = __importDefault(require("express"));
class BaseApp {
    constructor(props) {
        this.name = props.name || this.constructor.name.toLowerCase();
        this.routePrefix = props.routePrefix || '/';
    }
    init(expApp) {
        let startErrors = '';
        if (startErrors.length) {
            throw new Error(startErrors);
        }
        this.initPages(expApp);
    }
    initPages(expApp) {
        const pagesPath = `@apps/${this.name}/pages`;
        const router = express_1.default.Router();
        const pages = require(pagesPath);
        for (const [pageName, page] of Object.entries(pages)) {
            page.init(this.name);
            router.get(page.route, (req, res, next) => page.processHttp.call(page, req, res, next));
        }
        expApp.use(this.routePrefix, router);
    }
}
exports.BaseApp = BaseApp;
//# sourceMappingURL=index.js.map