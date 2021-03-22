"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class GetTags extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { ids, labels, groupIds, groupLabels, } = params;
        const tags = await this.query('getList', {
            ids,
            labels,
            groupIds,
            groupLabels,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
            queryDebugLog: true,
        });
        return {
            tags,
        };
    }
}
exports.default = new GetTags({
    name: 'getTags',
});
