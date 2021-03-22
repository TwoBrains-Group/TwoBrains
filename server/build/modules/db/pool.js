"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.prepareQuery = exports.queryDefaultOptions = exports.QueryReturnType = void 0;
const pg_1 = require("pg");
const pg_pool_1 = __importDefault(require("pg-pool"));
const errors_1 = require("./errors");
var QueryReturnType;
(function (QueryReturnType) {
    QueryReturnType[QueryReturnType["Row"] = 0] = "Row";
    QueryReturnType[QueryReturnType["Rows"] = 1] = "Rows";
    QueryReturnType[QueryReturnType["None"] = 2] = "None";
})(QueryReturnType = exports.QueryReturnType || (exports.QueryReturnType = {}));
exports.queryDefaultOptions = {
    returnType: QueryReturnType.None,
    returnField: undefined,
    queryDebugLog: false,
    unusedToNull: [],
};
const prepareQuery = (queryName, queryString, params = {}, options = {}) => {
    const values = [];
    let paramIndex = 0;
    const unusedQueryParams = [];
    let text = queryString;
    for (const param of Object.keys(params)) {
        const pattern = new RegExp(`/\\*\\s*${param}:([^\\*]*)\\*/`, 'gm');
        text = text.replace(pattern, '$1');
    }
    text = text.replace(/\/\*[\s\S]*?\*\//gms, '');
    text = text.replace(/(?<!:):(\w+)/g, (text, variable) => {
        if (variable in params) {
            ++paramIndex;
            values.push(params[variable]);
            return `$${paramIndex}`;
        }
        else if (options.unusedToNull?.includes(variable)) {
            return 'null';
        }
        else {
            unusedQueryParams.push(variable);
        }
        return text;
    }).trim();
    if (unusedQueryParams.length) {
        throw new errors_1.UnusedQueryParams(unusedQueryParams, queryName);
    }
    return {
        text,
        values,
    };
};
exports.prepareQuery = prepareQuery;
class Pool extends pg_pool_1.default {
    constructor(options) {
        super({
            Client: pg_1.Client,
            ...options,
        });
    }
    exec(queryObject) {
        return super.query(queryObject);
    }
}
exports.Pool = Pool;
