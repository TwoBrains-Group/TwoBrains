"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@utils/errors");
const db_1 = __importDefault(require("@modules/db"));
const queries_1 = __importDefault(require("./queries"));
const pool_1 = require("@modules/db/pool");
const logger_1 = __importDefault(require("@modules/logger"));
class BasePlugin {
    constructor(props) {
        this.name = props.name;
        this.log = new logger_1.default({
            owner: `Plugin_${this.name}`,
        });
    }
    async init() {
        this.db = await db_1.default.getInstance();
        this.id = await this.db.query('getPluginId', queries_1.default.getPluginId, {
            name: this.name,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        this.log.info(`Inited with id: ${this.id}`);
    }
    async bind(project) {
        const extended = {
            ...project,
            plugins: [],
        };
        const pluginData = await this.run(project);
        extended.plugins.push(pluginData);
        return extended;
    }
    async run(project) {
        throw new errors_1.MustBeOverridden('method \'run\'', `plugin ${this.name}`);
    }
}
exports.default = BasePlugin;
