"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
class LikeComment extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id } = params;
        const { id: userId } = user;
        const liked = await this.query('isCommentLiked', { id }, {
            returnType: Pool_1.QueryReturnType.Row,
            returnField: 'liked',
        });
        const queryName = liked ? 'unlikeComment' : 'likeComment';
        await this.query(queryName, { id, userId });
        return {
            liked: !liked,
        };
    }
}
exports.default = new LikeComment({
    route: 'likeComment',
});
//# sourceMappingURL=likeComment.js.map