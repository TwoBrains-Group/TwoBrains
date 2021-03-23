"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
class DeleteComment extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id } = params;
        const { id: userId } = user;
        const check = await this.query('checkCommentCreator', {
            id,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'userId',
        });
        if (!check) {
            throw new errors_1.BaseError('This is not your comment');
        }
        await this.query('deleteComment', {
            id,
            userId,
        });
        return {};
    }
}
exports.default = new DeleteComment({
    name: 'deleteComment',
});
