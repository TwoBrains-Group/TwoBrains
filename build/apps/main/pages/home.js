"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = require("@apps/base/Page");
const storage_1 = require("@utils/storage");
class Home extends Page_1.Page {
    constructor(props) {
        super(props);
    }
    async run(req, res) {
        return storage_1.storage.get({
            page: {
                kek: 'lol',
            },
        });
    }
}
exports.default = new Home({
    route: '/',
});
//# sourceMappingURL=home.js.map