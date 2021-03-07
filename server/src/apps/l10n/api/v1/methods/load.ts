import {Method, MethodRes, Req} from "@apps/base/Method";
import {QueryReturnType} from "@modules/db/Pool";

type Entities = {
    [key: string]: {
        app: string
        name: string
        page?: string
    }
}

type Schema = {
    components: Entities
    pages: Entities
}

class Load extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params} = req
        const {
            components,
            pages,
            locale,
        } = params

        // FIXME: Optimize (!!!)

        const data: Schema = {
            components: {},
            pages: {},
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
                queryDebugLog: true,
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
                queryDebugLog: true,
            }) || {}
        }

        console.log(`DATA:`, data)

        return {
            data,
        }
    }
}

export default new Load({
    route: 'load',
})
