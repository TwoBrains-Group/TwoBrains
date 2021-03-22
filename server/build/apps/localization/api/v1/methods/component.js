"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
class Component extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req, user) {
        const { params } = req;
        const { name, appName = '*', } = params;
        const data = await this.query('getComponentData', {
            name,
            appName,
        }, {
            returnType: Pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
        return { data };
    }
}
exports.default = new Component({
    route: 'component',
});
//# sourceMappingURL=component.js.map