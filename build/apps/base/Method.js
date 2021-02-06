"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const Route_1 = __importDefault(require("@apps/base/Route"));
const errors_1 = require("@utils/errors");
class Method extends Route_1.default {
    constructor(props = {}) {
        super(props);
    }
    run() {
        throw new errors_1.MustBeOverridden('run', this.getName());
    }
}
exports.Method = Method;
//# sourceMappingURL=Method.js.map