import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

const DEFAULT_LIMIT = 10

class Search extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {
            text: searchQuery,
            limit = DEFAULT_LIMIT,
        } = params

        const tags = await this.query('search', {
            searchQuery,
            limit,
        }, {
            returnType: QueryReturnType.Rows,
        })

        return {
            tags,
        }
    }
}

export default new Search({
    name: 'search',
})
