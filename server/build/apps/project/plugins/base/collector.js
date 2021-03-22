"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_plugins_1 = __importDefault(require("../project-plugins"));
class Collector {
    async init() {
        for (const [pluginName, plugin] of Object.entries(project_plugins_1.default)) {
            await plugin.init();
            this.plugins[plugin.id] = plugin;
        }
    }
    async bind(project) {
        for (const pluginId of project.pluginsIds) {
            if (!this.plugins[pluginId]) {
                throw new Error(`Plugin with id ${pluginId} not found`);
            }
            project = await this.plugins[pluginId].bind(project);
        }
        return project;
    }
}
exports.default = new Collector();
