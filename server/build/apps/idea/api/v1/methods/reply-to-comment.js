"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@apps/base/errors");
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class ReplyToComment extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { replyTo, text } = params;
        const { id: loggedInUserId } = user;
        const ideaId = await this.query('getCommentById', {
            id: replyTo,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'ideaId',
        });
        if (!ideaId) {
            throw new errors_1.BaseError('Unable to reply to comment');
        }
        const commentId = await this.query('replyToComment', {
            replyTo,
            ideaId,
            loggedInUserId,
            text,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'commentId',
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
exports.default = new ReplyToComment({
    name: 'replyToComment',
});
