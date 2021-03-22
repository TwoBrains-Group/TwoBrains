"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const DEFAULT_SEARCH_LIMIT = 3;
class Simple extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { text: searchQuery, limit = DEFAULT_SEARCH_LIMIT, } = params;
        const ideas = await this.query('searchIdeas', {
            searchQuery,
            limit,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        const users = await this.query('searchUsers', {
            searchQuery,
            limit,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            ideas,
            users,
        };
    }
}
exports.default = new Simple({
    name: 'simple',
});
