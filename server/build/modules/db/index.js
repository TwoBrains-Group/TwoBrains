"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModule_1 = require("@modules/BaseModule");
const instance_1 = __importDefault(require("@modules/db/instance"));
process.env.PG_OPTIONS = '-c search_path=main';
var pool_1 = require("./pool");
Object.defineProperty(exports, "Pool", { enumerable: true, get: function () { return pool_1.Pool; } });
class DB extends BaseModule_1.BaseModule {
    async getInstance() {
        const instance = new instance_1.default();
        await instance.init();
        return instance;
    }
    async close(instance) {
        await instance.end();
    }
}
exports.default = new DB();
