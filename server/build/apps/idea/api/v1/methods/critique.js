"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class Dislike extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id: ideaId } = params;
        const { id: userId } = user;
        const liked = await this.query('isCriticized', { ideaId, userId }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'criticized',
        });
        const queryName = liked ? 'unCriticize' : 'criticize';
        await this.query(queryName, { ideaId, userId });
        const likesCount = await this.query('getLikesCount', { ideaId }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        return {
            liked: !liked,
            ...likesCount,
        };
    }
}
exports.default = new Critique({});
