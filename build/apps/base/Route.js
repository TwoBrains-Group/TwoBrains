"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@utils/errors");
const logger_1 = __importDefault(require("@modules/logger"));
class Route {
    constructor(props = {}) {
        this.appName = '';
        this.log = new logger_1.default({
            owner: this.constructor.name.toLowerCase()
        });
    }
    async init(appName) {
        this.appName = appName;
        await this._init();
    }
    processHttp(req, res, next) {
        throw new errors_1.MustBeOverridden('processHttp', this.getName());
    }
    getName() {
        return this.appName + '/' + this.constructor.name.toLowerCase();
    }
    _init() {
        throw new errors_1.MustBeOverridden('_init', 'Route class');
    }
}
exports.default = Route;
//# sourceMappingURL=Route.js.map