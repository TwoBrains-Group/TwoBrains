"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class GetTop extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { group, count = 10, } = params;
        const tags = await this.query('getTop', {
            group,
            count,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            tags,
        };
    }
}
exports.default = new GetTop({
    name: 'getTop',
});
