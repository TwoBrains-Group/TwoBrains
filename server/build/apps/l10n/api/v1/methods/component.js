"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class Component extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req) {
        const { params } = req;
        const { name, appName = '*', } = params;
        const data = await this.query('getComponentData', {
            name,
            appName,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
        return { data };
    }
}
exports.default = new Component({
    route: 'component',
});
