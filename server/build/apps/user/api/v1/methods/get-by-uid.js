"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
const prepare_user_1 = require("../modules/prepare-user");
class GetByUid extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req, loggedInUser) {
        const { uid } = req.params;
        const { id: loggedInUserId } = loggedInUser;
        const user = await this.query('getUserByUid', {
            uid,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        if (!user) {
            throw new errors_1.MethodError('User not found');
        }
        prepare_user_1.prepareFollowingStatus(user);
        user.isMe = user.id === loggedInUserId;
        return {
            user,
        };
    }
}
exports.default = new GetByUid({
    name: 'getByUid',
});
