"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const errors_1 = require("@utils/errors");
const logger_1 = __importDefault(require("@modules/logger"));
class Route {
    constructor(props) {
        this.appName = '';
        this.log = new logger_1.default({
            owner: this.constructor.name.toLowerCase()
        });
        this.useDB = props.useDB || true;
    }
    async init(appName) {
        this.appName = appName;
        await this._init();
    }
    _init() {
        throw new errors_1.MustBeOverridden('_init', 'Route class');
    }
    processHttp(req, res, next) {
        throw new errors_1.MustBeOverridden('processHttp', this.getName());
    }
    getName() {
        return this.appName + '/' + this.constructor.name.toLowerCase();
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map