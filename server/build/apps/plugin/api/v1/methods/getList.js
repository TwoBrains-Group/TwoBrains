"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class GetList extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const plugins = await this.query('getList', {}, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            plugins,
        };
    }
}
