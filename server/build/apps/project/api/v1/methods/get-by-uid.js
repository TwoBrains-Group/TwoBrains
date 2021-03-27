"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const prepare_1 = require("../modules/prepare");
class GetByUid extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { userUid, uid, } = params;
        const { id: loggedInUserId } = user;
        const project = await this.query('getProjectByUid', {
            userUid,
            uid,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        prepare_1.prepareProject(project);
        return {
            project,
        };
    }
}
exports.default = new GetByUid({
    name: 'getByUid',
});
