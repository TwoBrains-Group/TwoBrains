"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class LikeComment extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id } = params;
        const { id: userId } = user;
        const liked = await this.query('isCommentLiked', {
            id,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'liked',
        });
        const queryName = liked ? 'unlikeComment' : 'likeComment';
        await this.query(queryName, {
            id,
            userId,
        });
        const count = await this.query('getCommentLikesCount', {
            id,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'count',
        });
        return {
            liked: !liked,
            count,
        };
    }
}
exports.default = new LikeComment({
    name: 'likeComment',
});
