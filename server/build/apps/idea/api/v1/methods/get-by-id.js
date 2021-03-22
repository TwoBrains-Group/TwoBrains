"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const prepare_ideas_1 = require("../modules/prepare-ideas");
class GetById extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id: ideaId, tagsLimit = 5, } = params;
        const { id: loggedInUserId } = user;
        let idea = await this.query('getById', {
            ideaId,
            loggedInUserId,
            tagsLimit,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        idea = prepare_ideas_1.prepareIdea(idea);
        const likesCount = await this.query('getLikesCount', {
            ideaId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        return {
            idea: {
                ...idea,
                ...likesCount,
            },
        };
    }
}
exports.default = new GetById({
    name: 'getById',
});
