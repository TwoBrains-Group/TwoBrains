import {MethodError} from '@apps/base/errors'
import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class ReplyToComment extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {replyTo, text} = params
        const {id: loggedInUserId} = user

        const ideaId = await this.query('getCommentById', {
            id: replyTo,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'ideaId',
        })

        if (!ideaId) {
            throw new MethodError('Unable to reply to comment')
        }

        const commentId = await this.query('replyToComment', {
            replyTo,
            ideaId,
            loggedInUserId,
            text,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'commentId',
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

export default new ReplyToComment({
    route: 'replyToComment',
})
