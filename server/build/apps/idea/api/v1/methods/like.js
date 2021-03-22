"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class Like extends Method_1.Method {
    async run(req, user) {
        const { id: ideaId, dislike = false, } = req.params;
        const { id: userId } = user;
        const likeStatus = await this.query('getLikeStatus', {
            ideaId,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        if (likeStatus && likeStatus.exists && likeStatus.dislike != dislike) {
            await this.query('unlike', {
                ideaId,
                userId,
            });
            likeStatus.exists = false;
        }
        const queryName = likeStatus && likeStatus.exists ? 'unlike' : 'like';
        await this.query(queryName, {
            ideaId,
            userId,
            dislike,
        });
        const updatedStatus = await this.query('getLikeStatus', {
            ideaId,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        const likesCount = await this.query('getLikesCount', {
            ideaId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        return {
            ...updatedStatus,
            ...likesCount,
        };
    }
}
exports.default = new Like({
    name: 'like',
});
