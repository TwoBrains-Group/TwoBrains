import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

type DirectiveEntity = {
    [key: string]: {
        app: string
        name: string
        page?: string
    }
}

// type PluginEntity = {
//     // names?: string[]
//     ids?: string[]
// }
//
// type TableEntity = {
//     [key: string]: PluginEntity
// }

type Schema = {
    components: DirectiveEntity
    pages: DirectiveEntity
    // entities: TableEntity
}

// entity - query
// const TABLE_ENTITIES: Record<string, string> = {
//     plugins: 'getPluginsData',
// }

class Load extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {
            components,
            pages,
            // entities,
            locale,
        } = params

        // FIXME: Optimize (!!!)

        const data: Schema = {
            components: {},
            pages: {},
            entities: {},
        }

        for (const cmp of components) {
            const app = cmp.app
            const page = cmp.page
            const name = cmp.name

            data.components[`${app}_${page}_${name}`] = await this.query('getComponentData', {
                app,
                page,
                name,
                locale,
            }, {
                returnType: QueryReturnType.Row,
                returnField: 'data',
            }) || {}
        }

        for (const page of pages) {
            const app = page.app
            const name = page.name

            data.pages[`${app}_${name}`] = await this.query('getPageData', {
                app,
                name,
                locale,
            }, {
                returnType: QueryReturnType.Row,
                returnField: 'data',
            }) || {}
        }

        // for (const entity of entities) {
        //     const query = TABLE_ENTITIES[entity]
        //     if (!query) {
        //         this.log.debug(`Skipped unsupported entity ${entity}`)
        //         continue
        //     }
        //
        //     data.entities[entity] = await this.query(query, {locale, ...entity}, {
        //         returnType: QueryReturnType.Row,
        //         returnField: 'data',
        //     }) || {}
        // }

        console.log('DATA:', data)

        return {
            data,
        }
    }
}

export default new Load({
    route: 'load',
})
