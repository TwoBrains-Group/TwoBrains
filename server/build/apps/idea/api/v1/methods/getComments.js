"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
class GetComments extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { id } = params;
        const comments = this.query('getComments', { id }, {
            returnType: Pool_1.QueryReturnType.Rows,
            returnField: 'comments',
        });
        return { comments };
    }
}
exports.default = new GetComments({
    route: 'getComments'
});
//# sourceMappingURL=getComments.js.map