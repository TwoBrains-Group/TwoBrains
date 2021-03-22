"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_plugin_1 = __importDefault(require("@apps/project/plugins/base/base-plugin"));
class IdeaPlugin extends base_plugin_1.default {
    async run(project) {
    }
}
exports.default = new IdeaPlugin({
    name: 'idea',
});
