"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@utils/errors");
class BasePlugin {
    constructor(props) {
        this.name = props.name;
    }
    async plug(project) {
        const extended = {
            ...project,
            plugins: [],
        };
        const pluginData = await this.run(project);
        extended.plugins.push(pluginData);
        return extended;
    }
    async run(project) {
        throw new errors_1.MustBeOverridden('method \'run\'', `plugin ${this.name}`);
    }
}
exports.default = BasePlugin;
