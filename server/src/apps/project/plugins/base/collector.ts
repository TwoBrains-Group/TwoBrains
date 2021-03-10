import BasePlugin, {ProjectRow} from '@apps/project/plugins/base/base-plugin'
import projectPlugins from '../project-plugins'

class Collector {
    plugins: Record<string, BasePlugin>

    async init() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [pluginName, plugin] of Object.entries(projectPlugins)) {
            await plugin.init()
            this.plugins[plugin.id] = plugin
        }
    }

    async bind(project: ProjectRow) {
        for (const pluginId of project.pluginsIds) {
            if (!this.plugins[pluginId]) {
                throw new Error(`Plugin with id ${pluginId} not found`)
            }
            project = await this.plugins[pluginId].bind(project)
        }
        return project
    }
}

export default new Collector()
