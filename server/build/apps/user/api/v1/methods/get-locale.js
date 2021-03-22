"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
class GetLocale extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id } = user;
        const locale = await this.query('getLocale', { id }, {
            returnType: Pool_1.QueryReturnType.Row,
            returnField: 'locale'
        });
        return { locale };
    }
}
exports.default = new GetLocale({
    route: 'getLocale'
});
//# sourceMappingURL=get-locale.js.map