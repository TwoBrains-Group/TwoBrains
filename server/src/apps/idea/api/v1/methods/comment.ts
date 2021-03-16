import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class Comment extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {
            text,
            ideaId,
        } = params
        const {id: loggedInUserId} = user

        const commentId = await this.query('comment', {
            text,
            userId: loggedInUserId,
            ideaId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        const comment = await this.query('getCommentById', {
            id: commentId,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
        })

        return {
            comment,
        }
    }
}

export default new Comment({
    route: 'comment',
})
