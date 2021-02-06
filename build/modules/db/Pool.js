"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const pg_1 = require("pg");
const pg_pool_1 = __importDefault(require("pg-pool"));
const nanoid_1 = require("nanoid");
class Pool extends pg_pool_1.default {
    constructor(options) {
        super({ Client: pg_1.Client, ...options });
        this.id = nanoid_1.nanoid(16);
    }
    async exec(queryString, values) {
        return super.query(queryString, values);
    }
}
exports.Pool = Pool;
//# sourceMappingURL=Pool.js.map