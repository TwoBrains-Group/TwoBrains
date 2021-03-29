"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const prepare_ideas_1 = require("@apps/idea/api/v1/modules/prepare-ideas");
const DEFAULT_LIMIT = 10;
class GetList extends Method_1.Method {
    async run(req, user) {
        const { params: { offset = 0, limit = DEFAULT_LIMIT, relation = 'user', userUid, tagsLimit = 5, } } = req;
        const { id: loggedInUserId } = user;
        const params = {
            offset,
            limit,
            loggedInUserId,
            relation,
            tagsLimit,
        };
        if (userUid) {
            params.userUid = userUid;
        }
        let ideas = await this.query('getList', params, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        ideas = prepare_ideas_1.prepareIdeas(ideas);
        return {
            ideas,
        };
    }
}
exports.default = new GetList({
    name: 'getList',
});
