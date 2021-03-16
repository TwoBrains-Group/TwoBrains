import {MustBeOverridden} from '@utils/errors'
import {default as DB} from '@modules/db'
import DBInstance from '@modules/db/instance'
import queries from './queries'
import {QueryReturnType} from '@modules/db/pool'
import Logger from '@modules/logger'

export type PluginProps = {
    name: string
}

export type ProjectRow = {
    id: string
    name: string
    pluginsIds: string[]
}

// export type PluginsRows = {
//     [key: string]: any
// }

export type ExtendedProjectRow = ProjectRow & {
    plugins: Record<string, any>
}

class BasePlugin {
    name: string
    db: DBInstance

    // Plugin id in db
    public id: string

    log: Logger

    constructor(props: PluginProps) {
        this.name = props.name
        this.log = new Logger({
            owner: `Plugin_${this.name}`,
        })
    }

    async init(): Promise<void> {
        this.db = await DB.getInstance()

        this.id = await this.db.query('getPluginId', queries.getPluginId, {
            name: this.name,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        this.log.info(`Inited with id: ${this.id}`)
    }

    async bind(project: ProjectRow): Promise<ExtendedProjectRow> {
        const extended: ExtendedProjectRow = {
            ...project,
            plugins: [],
        }
        const pluginData = await this.run(project)
        extended.plugins.push(pluginData)
        return extended
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(project: ProjectRow): Promise<any> {
        throw new MustBeOverridden('method \'run\'', `plugin ${this.name}`)
    }
}

export default BasePlugin
