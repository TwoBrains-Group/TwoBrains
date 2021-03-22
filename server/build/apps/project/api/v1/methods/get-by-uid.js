"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class GetByUid extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { uid } = params;
        const { id: loggedInUserId } = user;
        const project = await this.query('getProjectByUid', {
            uid,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        return {
            project,
        };
    }
}
exports.default = new GetByUid({
    name: 'getByUid',
});
