"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApp = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("@modules/db"));
const logger_1 = __importDefault(require("@modules/logger"));
class BaseApp {
    constructor(props) {
        this.name = props.name || this.constructor.name.toLowerCase();
        this.routePrefix = props.routePrefix;
        this.log = new logger_1.default({
            owner: this.name,
        });
    }
    async init(expApp) {
        let startErrors = '';
        if (startErrors.length) {
            throw new Error(startErrors);
        }
        await this.initRoutes(expApp);
    }
    initRoutes(expApp) {
        const appData = {};
        const queriesPath = `@apps/${this.name}/queries.js`;
        try {
            appData.queries = new Map(Object.entries(require(queriesPath).default));
        }
        catch (error) {
            this.log.debug(`No queries found for app [${this.name}]`);
        }
        const pagesPath = `@apps/${this.name}/pages`;
        const pages = require(pagesPath);
        const router = express_1.default.Router();
        for (const [pageName, { default: page }] of Object.entries(pages)) {
            page.init(this.name, appData);
            router.get(page.route, async (req, res, next) => {
                if (page.useDB) {
                    page.db = await db_1.default.getPool();
                }
                this.log.info(`Get request to route: ${(this.routePrefix + page.route).replace(/\/{2,}/g, '/')}, load page [${pageName}]`);
                await page.processHttp.call(page, req, res, next);
                if (page.useDB) {
                    await db_1.default.close(page.db);
                }
            });
        }
        expApp.use(this.routePrefix, router);
    }
}
exports.BaseApp = BaseApp;
//# sourceMappingURL=index.js.map