"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_plugin_1 = __importDefault(require("@apps/project/plugins/base/base-plugin"));
const queries_1 = __importDefault(require("./queries"));
const pool_1 = require("@modules/db/pool");
class IdeaPlugin extends base_plugin_1.default {
    async bind(project) {
        const extended = project;
        const id = project.id;
        const ideas = await this.db.query('getProjectIdeas', queries_1.default.getProjectIdeas, {
            id,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        extended.plugins.ideas = {
            data: ideas,
        };
        return extended;
    }
}
exports.default = new IdeaPlugin({
    name: 'idea',
});
