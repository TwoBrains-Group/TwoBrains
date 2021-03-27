"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const DEFAULT_LIMIT = 10;
class Search extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { text: searchQuery, limit = DEFAULT_LIMIT, } = params;
        const tags = await this.query('search', {
            searchQuery,
            limit,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            tags,
        };
    }
}
exports.default = new Search({
    name: 'search',
});
