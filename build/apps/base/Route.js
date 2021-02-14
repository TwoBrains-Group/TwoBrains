"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const errors_1 = require("@utils/errors");
const logger_1 = __importDefault(require("@modules/logger"));
const Pool_1 = require("@modules/db/Pool");
class Route {
    constructor(props) {
        this.appName = '';
        this.log = new logger_1.default({
            owner: this.getName()
        });
        this.useDB = props.useDB || true;
    }
    async init(appName, appData) {
        this.appName = appName;
        this.queries = appData.queries;
        await this._init();
        this.log.info(`Route ${this.getName()} inited`);
    }
    _init() {
        throw new errors_1.MustBeOverridden('_init', 'Route class');
    }
    processHttp(req, res, next) {
        throw new errors_1.MustBeOverridden('processHttp', this.getName());
    }
    getName() {
        return this.appName + '/' + this.constructor.name.toLowerCase();
    }
    async query(queryName, params = {}, options = {}) {
        if (!this.useDB) {
            throw new Error(`Attempt to use DB in route with disabled DB (${this.getName()})`);
        }
        if (!this.db) {
            throw new Error(`Failed to initialize DB on request to route ${this.getName()}`);
        }
        const query = this.queries.get(queryName);
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getName()}`);
        }
        try {
            await this.db.exec({ text: 'SET search_path TO \'main\';' });
            const preparedQuery = Pool_1.prepareQuery(query, params);
            const result = await this.db.exec(preparedQuery);
            options = { ...Pool_1.queryDefaultOptions, ...options };
            if (options.returnType === Pool_1.QueryReturnType.ROW) {
                return options.returnField ? result.rows[0][options.returnField] : result.rows[0];
            }
            return result.rows;
        }
        catch (error) {
            this.log.error(`[DB Error] ${error}`);
        }
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map