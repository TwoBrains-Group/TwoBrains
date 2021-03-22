"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const prepare_user_1 = require("../modules/prepare-user");
class Follow extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id } = params;
        const { id: loggedInUserId } = user;
        const following = await this.query('isFollowing', {
            id,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'following',
        });
        const queryName = following ? 'unfollow' : 'follow';
        await this.query(queryName, {
            id,
            loggedInUserId,
        });
        const info = await this.query('getFollowingStatus', {
            id,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        prepare_user_1.prepareFollowingStatus(info);
        return {
            info,
        };
    }
}
exports.default = new Follow({
    name: 'follow',
});
