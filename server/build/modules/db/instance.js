"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@modules/db/errors");
const db_1 = require("@modules/db");
const pool_1 = require("@modules/db/pool");
const logger_1 = __importDefault(require("@modules/logger"));
const nanoid_1 = require("nanoid");
const sql_formatter_1 = require("sql-formatter");
const config_1 = require("@utils/config");
const { db: { connection } } = config_1.config;
class DBInstance {
    init() {
        this.id = nanoid_1.nanoid(16);
        this.log = new logger_1.default({
            owner: `DBInstance_${this.id}`,
        });
        this.pool = new db_1.Pool(connection);
        const { host, database, port } = connection;
        const dbUrl = `${host}:${port}/${database}`;
        this.pool.on('connect', async () => {
            this.log.debug(`Connection to ${dbUrl} established: ${this.getInfo()}`);
        });
        this.pool.on('error', async (error) => {
            this.log.error(`Pool ${this.id} error: ${error}`);
        });
    }
    async end() {
        await this.pool.end();
    }
    getInfo() {
        return `\n\tPool id:${this.id}\n\tTotal connections: ${this.pool.totalCount}\n\tWaiting count: ${this.pool.waitingCount}`;
    }
    async query(queryName, query, params = {}, options = {}) {
        options = {
            ...pool_1.queryDefaultOptions,
            ...options,
        };
        const { returnType, returnField, queryDebugLog } = options;
        if (queryDebugLog) {
            this.log.debug(`(query debug log) ${queryName}: Full params: ${JSON.stringify(params, null, 2)}`);
        }
        for (const paramName of Object.keys(params)) {
            if (params[paramName] === undefined) {
                delete params[paramName];
            }
        }
        if (queryDebugLog) {
            this.log.debug(`(query debug log) ${queryName}: Clean params: ${JSON.stringify(params, null, 2)}`);
        }
        try {
            await this.pool.exec({
                text: 'SET search_path TO \'main\';',
            });
            const preparedQuery = pool_1.prepareQuery(queryName, query, params, options);
            if (queryDebugLog) {
                const beautifulSql = sql_formatter_1.format(preparedQuery.text, {
                    language: 'postgresql',
                    indent: '    ',
                    uppercase: true,
                });
                this.log.debug(`(query debug log) ${queryName}:\n${beautifulSql}\nValues: ${JSON.stringify(preparedQuery.values, null, 2)}`);
            }
            const result = await this.pool.exec(preparedQuery);
            const { rows } = result;
            this.log.debug(`DB result: ${JSON.stringify(rows, null, 2)}`);
            if (!rows && returnType !== pool_1.QueryReturnType.None) {
                this.log.error('Got no rows when expected');
                return null;
            }
            if (returnType === pool_1.QueryReturnType.Row) {
                if (!rows.length) {
                    return null;
                }
                return returnField ? rows[0][returnField] : rows[0];
            }
            return rows;
        }
        catch (error) {
            if (!(error instanceof errors_1.DBError)) {
                this.log.warn('All errors thrown from DB module must be instances DBError');
            }
            this.log.error(`[DB Error] (${queryName}) ${error}`);
            if (error.fatal) {
                throw error.hide();
            }
        }
    }
}
exports.default = DBInstance;
