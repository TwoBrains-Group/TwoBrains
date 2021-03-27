import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareProjects} from '@apps/project/api/v1/modules/prepare'

const DEFAULT_LIMIT = 10

class GetList extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {
            limit = DEFAULT_LIMIT,
            offset = 0,
        } = params
        const {id: loggedInUserId} = user

        const projects = await this.query('getList', {
            limit,
            offset,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Rows,
        })

        prepareProjects(projects)

        return {
            projects,
        }
    }
}

export default new GetList({
    name: 'getList',
})
