"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const BaseModule_1 = require("@modules/BaseModule");
const Pool_1 = require("./Pool");
const config_1 = require("@utils/config");
process.env.PG_OPTIONS = "-c search_path=main";
const { db: { connection } } = config_1.config;
var Pool_2 = require("./Pool");
Object.defineProperty(exports, "Pool", { enumerable: true, get: function () { return Pool_2.Pool; } });
class DB extends BaseModule_1.BaseModule {
    constructor(props = {}) {
        super(props);
    }
    async getPool() {
        const instance = new Pool_1.Pool(connection);
        const { host, db, port } = connection;
        const dbUrl = `${host}:${port}/${db}`;
        instance.on('connect', async (client) => {
            this.log.debug(`Connection to ${dbUrl} established: ${this.getInstanceInfo(instance)}`);
        });
        instance.on('error', async (error) => {
            this.log.error(`Pool ${instance.id} error: ${error}`);
        });
        return instance;
    }
    getInstanceInfo(instance) {
        return `\n\tPool id:${instance.id}\n\tTotal connections: ${instance.totalCount}\n\tWaiting count: ${instance.waitingCount}`;
    }
    async close(instance) {
        await instance.end();
    }
}
exports.default = new DB();
//# sourceMappingURL=index.js.map