"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class Load extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { locale } = params;
        const cmp = await this.query('getComponentsL10n', {
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
        const page = await this.query('getPagesL10n', {
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
        return {
            cmp,
            page,
        };
    }
}
exports.default = new Load({
    name: 'load',
    auth: false,
});
