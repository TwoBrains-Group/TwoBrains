"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApp = void 0;
const api_1 = __importDefault(require("@apps/base/api"));
const logger_1 = __importDefault(require("@modules/logger"));
class BaseApp {
    constructor(props) {
        this.name = props.name || this.constructor.name.toLowerCase();
        this.log = new logger_1.default({
            owner: this.name,
        });
    }
    async init(expApp) {
        await this._init(expApp);
        await api_1.default.init(this.name);
        this.log.info('App inited');
    }
    async _init(expApp) { }
}
exports.BaseApp = BaseApp;
