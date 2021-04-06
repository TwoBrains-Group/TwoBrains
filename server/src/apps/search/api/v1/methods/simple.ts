import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

const DEFAULT_SEARCH_LIMIT = 3

class Simple extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {
            text: searchQuery,
            limit = DEFAULT_SEARCH_LIMIT,
        } = params

        const ideas = await this.query('searchIdeas', {
            searchQuery,
            limit,
        }, {
            returnType: QueryReturnType.Rows,
        })

        const users = await this.query('searchUsers', {
            searchQuery,
            limit,
        }, {
            returnType: QueryReturnType.Rows,
        })

        const projects = await this.query('searchProjects', {
            searchQuery,
            limit,
        }, {
            returnType: QueryReturnType.Rows,
        })

        return {
            ideas,
            users,
            projects,
        }
    }
}

export default new Simple({
    name: 'simple',
})
