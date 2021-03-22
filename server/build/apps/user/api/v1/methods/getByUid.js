"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
const errors_1 = require("@apps/base/errors");
class GetByUid extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req) {
        const { uid } = req.params;
        const user = await this.query('getUserByUid', { uid }, {
            returnType: Pool_1.QueryReturnType.Row,
            queryDebugLog: true,
        });
        if (!user) {
            throw new errors_1.MethodError('User not found');
        }
        console.log(`User: ${JSON.stringify(user, null, 2)}`);
        return {
            user,
        };
    }
}
exports.default = new GetByUid({
    route: 'getByUid'
});
//# sourceMappingURL=getByUid.js.map