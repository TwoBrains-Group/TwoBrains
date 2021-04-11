import {AuthUser, Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {BaseError} from '@apps/_base/errors'

class DeleteComment extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {id} = params
        const {id: userId} = user

        const check = await this.query('checkCommentCreator', {
            id,
            userId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'userId',
        })

        if (!check) {
            throw new BaseError('This is not your comment')
        }

        await this.query('deleteComment', {
            id,
            userId,
        })

        return {}
    }
}

export default new DeleteComment({
    name: 'deleteComment',
})
