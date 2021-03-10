import BasePlugin, {ExtendedProjectRow, ProjectRow} from '@apps/project/plugins/base/base-plugin'
import queries from './queries'
import {QueryReturnType} from '@modules/db/pool'

class IdeaPlugin extends BasePlugin {
    async bind(project: ProjectRow): Promise<ExtendedProjectRow> {
        const extended = project as ExtendedProjectRow

        const id = project.id
        const ideas = await this.db.query('getProjectIdeas', queries.getProjectIdeas, {id}, {
            returnType: QueryReturnType.Rows,
        })

        extended.plugins.ideas = {
            data: ideas,
        }

        return extended
    }
}

export default new IdeaPlugin({
    name: 'idea',
})
