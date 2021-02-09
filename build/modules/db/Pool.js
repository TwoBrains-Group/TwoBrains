"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.prepareQuery = exports.queryDefaultOptions = exports.QueryReturnType = void 0;
const pg_1 = require("pg");
const pg_pool_1 = __importDefault(require("pg-pool"));
const nanoid_1 = require("nanoid");
var QueryReturnType;
(function (QueryReturnType) {
    QueryReturnType[QueryReturnType["ROW"] = 0] = "ROW";
    QueryReturnType[QueryReturnType["ROWS"] = 1] = "ROWS";
})(QueryReturnType = exports.QueryReturnType || (exports.QueryReturnType = {}));
exports.queryDefaultOptions = {
    returnType: QueryReturnType.ROWS,
};
const prepareQuery = (queryString, params = {}) => {
    let paramIndex = 0;
    const values = [];
    const text = queryString.replace(/:(\w+)/g, (text, variable) => {
        if (variable in params) {
            ++paramIndex;
            values.push(params[variable]);
            return `$${paramIndex}`;
        }
        return text;
    }).trim();
    return {
        text,
        values,
    };
};
exports.prepareQuery = prepareQuery;
class Pool extends pg_pool_1.default {
    constructor(options) {
        super({ Client: pg_1.Client, ...options });
        this.id = nanoid_1.nanoid(16);
    }
    exec(queryObject) {
        return super.query(queryObject);
    }
}
exports.Pool = Pool;
//# sourceMappingURL=Pool.js.map