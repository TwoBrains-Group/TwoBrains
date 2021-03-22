"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class New extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { name, text, } = params;
        const { id: userId } = user;
        const { id } = await this.query('create', { name, text, userId }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        return { id };
    }
}
exports.default = new New({
    route: 'create',
});
