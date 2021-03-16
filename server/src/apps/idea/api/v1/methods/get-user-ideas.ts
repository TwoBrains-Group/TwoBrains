import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareIdeas} from '../modules/prepare-ideas'

const DEFAULT_LIMIT = 25

class GetUserIdeas extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user
        const {uid, offset = 0, limit = DEFAULT_LIMIT} = params

        let ideas = await this.query('getUserIdeas', {
            uid: uid || loggedInUserId,
            offset,
            limit,
        }, {
            returnType: QueryReturnType.Rows,
        })

        ideas = prepareIdeas(ideas)

        return {
            ideas,
        }
    }
}

export default new GetUserIdeas({
    route: 'getUserIdeas',
})
