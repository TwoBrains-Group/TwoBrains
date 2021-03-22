"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class GetTags extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { ids, groups } = params;
        const tags = await this.query('getTags', {
            ids,
            groups,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            tags,
        };
    }
}
exports.default = new GetTags({
    route: 'getTags',
});
