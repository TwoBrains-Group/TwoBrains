"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const storage_1 = require("@utils/storage");
const Route_1 = require("@apps/base/Route");
const errors_1 = require("@utils/errors");
class Page extends Route_1.Route {
    constructor(props) {
        super(props);
        this.route = props.route;
    }
    _init() {
        if (!this.route) {
            throw new Error(`Route is not specified for page ${super.getName()}`);
        }
        this.data = storage_1.storage.get();
        this.data.info.path = super.getName();
    }
    async run(req, res, next) {
        throw new errors_1.MustBeOverridden('run', super.getName());
    }
    async processHttp(req, res, next) {
        try {
            const responseData = await this.run(req, res);
            res.render(this.data.info.path, responseData);
        }
        catch (error) {
            this.log.error(`Error on processing page ${this.getName()}: error`);
        }
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map