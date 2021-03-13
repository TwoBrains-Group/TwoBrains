import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class LikeComment extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params} = req
        const {id} = params
        const {id: userId} = user

        const liked = await this.query('isCommentLiked', {id, userId}, {
            returnType: QueryReturnType.Row,
            returnField: 'liked',
        })

        const queryName = liked ? 'unlikeComment' : 'likeComment'

        await this.query(queryName, {id, userId})

        const count = await this.query('getCommentLikesCount', {id, userId}, {
            returnType: QueryReturnType.Row,
            returnField: 'count',
        })

        return {
            liked: !liked,
            count,
        }
    }
}

export default new LikeComment({
    route: 'likeComment',
})
