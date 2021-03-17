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
            userUid,
        }} = req

        const {id: loggedInUserId} = user

        const params: Record<string, any> = {
            offset,
            limit,
            loggedInUserId,
            relation,
        }

        if (userUid) {
            params.userUid = userUid
        }

        let ideas = await this.query('getList', {
            offset,
            limit,
            loggedInUserId,
            relation,
        }, {
            returnType: QueryReturnType.Rows,
            queryDebugLog: true,
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
