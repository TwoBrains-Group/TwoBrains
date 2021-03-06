import {Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareIdea} from '../modules/prepare-ideas'

class GetById extends Method {
    async run(req: Req, user?: any) : Promise<MethodRes> {
        const {params} = req
        const {
            id: ideaId,
            tagsLimit = 5,
        } = params
        const {id: loggedInUserId} = user

        let idea = await this.query('getById', {
            ideaId,
            loggedInUserId,
            tagsLimit,
        }, {
            returnType: QueryReturnType.Row,
        })

        idea = prepareIdea(idea)

        const likesCount = await this.query('getLikesCount', {
            ideaId,
        }, {
            returnType: QueryReturnType.Row,
        })

        return {
            idea: {
                ...idea,
                ...likesCount,
            },
        }
    }
}

export default new GetById({
    name: 'getById',
})
