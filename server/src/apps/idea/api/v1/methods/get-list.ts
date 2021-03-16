import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareIdeas} from '@apps/idea/api/v1/modules/prepare-ideas'

const DEFAULT_LIMIT = 10

class GetList extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params: {
            offset = 0,
            limit = DEFAULT_LIMIT,
            relation = 'user',
        }} = req

        const {id: loggedInUserId} = user

        let ideas = await this.query('getList', {
            offset,
            limit,
            loggedInUserId,
            relation,
        }, {
            returnType: QueryReturnType.Rows,
            queryDebugLog: true,
            args: {
                relation,
            },
        })

        ideas = prepareIdeas(ideas)

        return {
            ideas,
        }
    }
}

export default new GetList({
    route: 'getList',
})
