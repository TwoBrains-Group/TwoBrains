"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@apps/index"));
class Api {
    async callMethod(appName, methodName) {
        if (!Object.keys(index_1.default).includes(appName)) {
            throw new Error(`Cannot find app ${appName}`);
        }
        const app = index_1.default[appName];
        if (!Object.keys(app.methods)) {
        }
    }
}
new Api();
//# sourceMappingURL=api.js.map