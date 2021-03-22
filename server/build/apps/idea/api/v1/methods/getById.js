"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
const errors_1 = require("@apps/base/errors");
class GetById extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req) {
        const { params: { id } } = req;
        if (!id) {
            throw new errors_1.MethodError('Idea id is required');
        }
        const idea = await this.query('getById', { id }, {
            returnType: Pool_1.QueryReturnType.Row,
        });
        return { idea };
    }
}
exports.default = new GetById({
    route: 'getById',
});
//# sourceMappingURL=getById.js.map