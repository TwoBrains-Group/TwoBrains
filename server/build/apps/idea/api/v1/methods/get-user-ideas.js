"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const prepare_ideas_1 = require("../modules/prepare-ideas");
const DEFAULT_LIMIT = 25;
class GetUserIdeas extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { uid: loggedInUserUid, id: loggedInUserId } = user;
        const { uid, offset = 0, limit = DEFAULT_LIMIT } = params;
        let ideas = await this.query('getList', {
            userUid: uid || loggedInUserUid,
            loggedInUserId,
            offset,
            limit,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
            queryDebugLog: true,
        });
        ideas = prepare_ideas_1.prepareIdeas(ideas);
        return {
            ideas,
        };
    }
}
exports.default = new GetUserIdeas({
    route: 'getUserIdeas',
});
