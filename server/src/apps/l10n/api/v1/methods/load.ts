import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

type DirectiveEntity = {
    [key: string]: {
        app: string
        name: string
        page?: string
    }
}

type Schema = {
    components: DirectiveEntity
    pages: DirectiveEntity
}

// const DEFAULT_LOCALE = 'en'

type CmpQueryParams = {
    app: string
    name: string
}

type PageQueryParams = {
    app: string
    name: string
}

class Load extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {
            // components,
            // pages,
            locale,
        } = params

        // FIXME: Optimize (!!!)

        // FIXME: Direct loading was turned off due to bugs with components/pages collecting
        //  Now just load all the data by locale


        const data: Schema = {
            components: {},
            pages: {},
        }

        data.components = await this.query('getAllComponentsData', {
            locale,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'data',
        })

        data.pages = await this.query('getAllPagesData', {
            locale,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'data',
        })

        // for (const cmp of components) {
        //     const app = cmp.app
        //     const name = cmp.name
        //
        //     const params: CmpQueryParams = {app, name}
        //
        //     let cmpData = await this.loadComponentData(params, locale)
        //
        //     if (!cmpData) {
        //         cmpData = await this.loadComponentData(params, DEFAULT_LOCALE)
        //     }
        //
        //     data.components[`${app}_${name}`] = cmpData || {}
        // }
        //
        // for (const page of pages) {
        //     const app = page.app
        //     const name = page.name
        //
        //     const params: PageQueryParams = {app, name}
        //     let pageData = await this.loadPageData(params, locale)
        //
        //     if (!pageData) {
        //         pageData = await this.loadPageData(params, DEFAULT_LOCALE)
        //     }
        //
        //     data.pages[`${app}_${name}`] = pageData || {}
        // }

        return {
            data,
        }
    }

    async loadComponentData(params: CmpQueryParams, locale: string): Promise<any> {
        return await this.query('getComponentData', {
            ...params,
            locale,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'data',
        })
    }

    async loadPageData(params: PageQueryParams, locale: string): Promise<any> {
        return await this.query('getPageData', {
            ...params,
            locale,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'data',
        })
    }
}

export default new Load({
    route: 'load',
})
