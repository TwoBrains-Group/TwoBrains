"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = exports.METHOD_EVENTS = void 0;
const errors_1 = require("@utils/errors");
const logger_1 = __importDefault(require("@modules/logger"));
const db_1 = __importDefault(require("@modules/db"));
const pool_1 = require("@modules/db/pool");
const ajv_1 = __importDefault(require("@modules/ajv"));
const errors_2 = require("@apps/base/errors");
const events_1 = __importDefault(require("events"));
exports.METHOD_EVENTS = {
    BEFORE: 'before',
    AFTER: 'after',
    BEFORE_AUTH_CHECK: 'BEFORE_AUTH_CHECK',
};
class Method extends events_1.default {
    constructor(props) {
        super();
        this.appName = '';
        this.name = props.name || this.getName();
        this.useDB = props.useDB || true;
        this.formData = props.formData;
        this.formDataMult = props.formDataMult;
        if ('auth' in props) {
            this.auth = props.auth;
        }
        else {
            this.auth = true;
        }
    }
    async init(data) {
        this.appName = data.appName;
        this.queries = data.queries;
        this.schema = data.schema;
        this.validateSchema = ajv_1.default.compile(this.schema);
        this.log = new logger_1.default({
            owner: this.getPath(),
        });
        if (this.useDB) {
            this.db = await db_1.default.getInstance();
        }
        await this._init();
        this.log.info(`Method ${this.getPath()} inited`);
    }
    async validate({ params }) {
        const valid = await this.validateSchema(params);
        if (!valid) {
            console.log(this.validateSchema.errors);
            throw new errors_2.InvalidParams(ajv_1.default.errors || this.validateSchema.errors);
        }
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
