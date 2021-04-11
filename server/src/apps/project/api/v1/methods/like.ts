import {AuthUser, Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'

class Like extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user
        const {id} = params

        const liked = await this.query('isLiked', {
            id,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'liked',
        })

        const queryName = liked ? 'dislike' : 'like'

        await this.query(queryName, {
            loggedInUserId,
            id,
        })

        const likesCount = await this.query('getLikesCount', {
            id,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'count',
        })

        return {
            liked: !liked,
            likesCount,
        }
    }
}

export default new Like({
    name: 'like',
})
