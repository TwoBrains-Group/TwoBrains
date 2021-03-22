"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class Comment extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { text, ideaId, } = params;
        const { id: loggedInUserId } = user;
        const commentId = await this.query('comment', {
            text,
            userId: loggedInUserId,
            ideaId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        const comment = await this.query('getCommentById', {
            id: commentId,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        return {
            comment,
        };
    }
}
exports.default = new Comment({
    name: 'comment',
});
