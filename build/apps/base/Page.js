"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const storage_1 = require("@utils/storage");
const Route_1 = __importDefault(require("@apps/base/Route"));
const errors_1 = require("@utils/errors");
const db_1 = __importDefault(require("@modules/db"));
class Page extends Route_1.default {
    constructor(props) {
        super(props);
        this.route = props.route;
        this.useDB = props.useDB || true;
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
        let result = {};
        try {
            if (this.useDB) {
                this.db = await db_1.default.getPool();
            }
            result = this.run(req, res);
            if (this.useDB) {
                await db_1.default.close(this.db);
            }
        }
        catch (error) {
            this.log.error();
        }
        let responseData = storage_1.storage.get({
            ...this.data,
            page: result,
        });
        res.render(this.data.info.path, responseData);
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map