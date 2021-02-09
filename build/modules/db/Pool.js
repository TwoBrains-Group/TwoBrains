"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.prepareQuery = exports.queryDefaultOptions = exports.QueryReturnType = void 0;
const pg_1 = require("pg");
const pg_pool_1 = __importDefault(require("pg-pool"));
const nanoid_1 = require("nanoid");
const errors_1 = require("@utils/errors");
const strict = process.env.ENV.toLowerCase() === 'prod';
var QueryReturnType;
(function (QueryReturnType) {
    QueryReturnType[QueryReturnType["ROW"] = 0] = "ROW";
    QueryReturnType[QueryReturnType["ROWS"] = 1] = "ROWS";
})(QueryReturnType = exports.QueryReturnType || (exports.QueryReturnType = {}));
exports.queryDefaultOptions = {
    returnType: QueryReturnType.ROWS,
};
exports.prepareQuery = (queryString, params = {}) => {
    let paramIndex = 0;
    const values = [];
    const unusedVariables = [];
    const text = queryString.replace(/:(\w+)/g, (text, variable) => {
        if (variable in params) {
            ++paramIndex;
            values.push(params[variable]);
            return `$${paramIndex}`;
        }
        unusedVariables.push(variable);
        return text;
    }).trim();
    if (unusedVariables.length > 0 && strict) {
        throw new errors_1.UnusedQueryParams(unusedVariables);
    }
    return {
        text,
        values,
    };
};
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