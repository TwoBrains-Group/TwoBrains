"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class GetLocales extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { translatable } = params;
        const locales = await this.query('getLocales', {
            translatable,
        }, {
            returnType: pool_1.QueryReturnType.Rows,
        });
        return {
            locales,
        };
    }
}
exports.default = new GetLocales({
    name: 'getLocales',
});
