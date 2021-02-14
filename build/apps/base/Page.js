"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const storage_1 = require("@utils/storage");
const Route_1 = require("@apps/base/Route");
const errors_1 = require("@utils/errors");
const logger_1 = require("@modules/logger");
class Page extends Route_1.Route {
    constructor(props) {
        super(props);
        this.route = props.route.replace(/\/{2,}/g, '/');
    }
    _init() {
    }
    async run(req, res, next) {
        throw new errors_1.MustBeOverridden('run', super.getName());
    }
    async processHttp(req, res, next) {
        try {
            const pageData = await this.run(req, res);
            const data = storage_1.storage.get({
                page: pageData,
                info: {
                    path: this.getName(),
                },
            });
            this.log.info(logger_1.lf `Render page with data: ${data}`);
            res.render(`apps/${this.getName()}`, data);
        }
        catch (error) {
            this.log.error(`Error on processing page ${this.getName()}: ${error}`);
        }
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map