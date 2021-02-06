"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModule = void 0;
const logger_1 = __importDefault(require("@modules/logger"));
class BaseModule {
    constructor(props = {}) {
        this.log = new logger_1.default({
            owner: this.constructor.name || props.name
        });
    }
}
exports.BaseModule = BaseModule;
//# sourceMappingURL=BaseModule.js.map