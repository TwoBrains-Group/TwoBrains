"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const BaseModule_1 = require("@modules/BaseModule");
const Pool_1 = require("./Pool");
const config_1 = require("@utils/config");
const { db: { connection } } = config_1.config;
var Pool_2 = require("./Pool");
Object.defineProperty(exports, "Pool", { enumerable: true, get: function () { return Pool_2.Pool; } });
class DB extends BaseModule_1.BaseModule {
    constructor(props = {}) {
        super(props);
    }
    async getPool() {
        const instance = new Pool_1.Pool(connection);
        const { host, db_name, port } = connection;
        const dbUrl = `${host}:${port}/${db_name}`;
        instance.on('connect', async (client) => {
            this.log.debug(`Connection to ${dbUrl} established:${this.getInstanceInfo(instance)}`);
        });
        instance.on('error', async (error) => {
            this.log.error(`Connection to ${dbUrl} closed`);
        });
        return instance;
    }
    getInstanceInfo(instance) {
        return `\tPool id:${instance.id}\tTotal connections: ${instance.totalCount}\tWaiting count: ${instance.waitingCount}`;
    }
    async close(instance) {
        await instance.end();
    }
}
exports.default = new DB();
//# sourceMappingURL=index.js.map