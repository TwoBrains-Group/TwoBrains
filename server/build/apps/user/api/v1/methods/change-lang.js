"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
class ChangeLang extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { locale } = params;
        const { id } = user;
        const newLocale = await this.query('changeLang', {
            id,
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'locale',
        });
        if (!newLocale) {
            throw new errors_1.MethodError('Locale not found');
        }
        return {
            locale: newLocale,
        };
    }
}
exports.default = new ChangeLang({
    name: 'changeLang',
});
