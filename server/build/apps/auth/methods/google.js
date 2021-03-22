"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
class Google extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req) {
        this.log.info(`Request: ${JSON.stringify(req, null, 2)}`);
        return {
            result: {
                kek: 'lol'
            }
        };
    }
}
exports.default = new Google({
    route: '/google/callback'
});
//# sourceMappingURL=google.js.map