"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
class Edit extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id, name, text, tags, } = params;
        const { id: loggedInUserId } = user;
        const checkAuthor = await this.query('checkAuthor', {
            id,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        if (!checkAuthor) {
            throw new errors_1.AuthError('You cannot edit idea that not belongs to you');
        }
        const ideaId = await this.query('edit', {
            id,
            name,
            text,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        await this.query('deleteTags', {
            id,
            tags,
        });
        return {
            id: ideaId,
        };
    }
}
exports.default = new Edit({
    name: 'edit',
});
