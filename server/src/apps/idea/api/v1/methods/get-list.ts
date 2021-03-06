import {Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareIdeas} from '@apps/idea/api/v1/modules/prepare-ideas'

const DEFAULT_LIMIT = 10

class GetList extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params: {
            offset = 0,
            limit = DEFAULT_LIMIT,
            relation = 'user',
            userUid,
            tagsLimit = 5,
        }} = req

        const {id: loggedInUserId} = user

        const params: Record<string, any> = {
            offset,
            limit,
            loggedInUserId,
            relation,
            tagsLimit,
            userUid,
        }

        let ideas = await this.query('getList', params, {
            returnType: QueryReturnType.Rows,
        })

        ideas = prepareIdeas(ideas)

        return {
            ideas,
        }
    }
}

export default new GetList({
    name: 'getList',
})
