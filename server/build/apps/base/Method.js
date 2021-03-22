"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const errors_1 = require("@utils/errors");
const logger_1 = __importDefault(require("@modules/logger"));
const db_1 = __importDefault(require("@modules/db"));
const pool_1 = require("@modules/db/pool");
class Method {
    constructor(props) {
        this.appName = '';
        this.name = props.name || this.getName();
        this.useDB = props.useDB || true;
        this.formData = props.formData;
        this.formDataMult = props.formDataMult;
    }
    async init(data) {
        this.appName = data.appName;
        this.queries = data.queries;
        this.validateSchema = data.validateSchema;
        this.log = new logger_1.default({
            owner: `${this.appName}/${this.getPath()}`,
        });
        if (this.useDB) {
            this.db = await db_1.default.getInstance();
        }
        await this._init();
        this.log.info(`Method ${this.getPath()} inited`);
    }
    async _init() { }
    async run(req, user) {
        throw new errors_1.MustBeOverridden('run', `method ${this.getPath()}`);
    }
    async runFormData(req, user) {
        throw new errors_1.MustBeOverridden('runFormData', `method ${this.getPath()}`);
    }
    getPath() {
        return this.appName + '/' + this.getName();
    }
    getName() {
        return this.constructor.name[0].toLowerCase() + this.constructor.name.slice(1);
    }
    async query(queryName, params = {}, options = {}) {
        if (!this.useDB) {
            throw new Error(`Attempt to use DB in route with disabled DB (${this.getPath()})`);
        }
        if (!this.db) {
            throw new Error(`Failed to initialize DB on request to route ${this.getPath()}`);
        }
        options = {
            ...pool_1.queryDefaultOptions,
            ...options,
        };
        let query = this.queries[queryName];
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getPath()}`);
            return null;
        }
        if (typeof query === 'function') {
            if (!options.args) {
                throw new Error(`(${queryName}) 'args' must be passed to query options for func-type query`);
            }
            query = query(options.args);
        }
        return await this.db.query(queryName, query, params, options);
    }
}
exports.Method = Method;
