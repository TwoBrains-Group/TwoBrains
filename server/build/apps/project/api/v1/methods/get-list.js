"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const DEFAULT_LIMIT = 10;
class GetList extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { limit = DEFAULT_LIMIT, offset = 0, } = params;
        const { id: loggedInUserId } = user;
        const projects = await this.query('getList', {
            limit,
            offset,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            projects,
        };
    }
}
exports.default = new GetList({
    name: 'getList',
});