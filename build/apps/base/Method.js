"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const Route_1 = require("@apps/base/Route");
const errors_1 = require("@utils/errors");
class Method extends Route_1.Route {
    constructor(props = {}) {
        super(props);
    }
    run() {
        throw new errors_1.MustBeOverridden('run', this.getName());
    }
}
exports.Method = Method;
//# sourceMappingURL=Method.js.map