"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("@apps/base/Page");
const Pool_1 = require("@modules/db/Pool");
class Home extends Page_1.Page {
    constructor(props) {
        super(props);
    }
    async run(req, res) {
        const result = await this.query('kek', { param: 'kek' }, {
            returnType: Pool_1.QueryReturnType.ROW,
            returnField: 'kek'
        });
        this.log.info(`result: ${JSON.stringify(result, null, 2)}`);
        return {
            kek: result,
        };
    }
}
exports.default = new Home({
    route: '/',
});
//# sourceMappingURL=home.js.map