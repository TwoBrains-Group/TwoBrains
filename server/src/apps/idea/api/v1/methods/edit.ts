import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {AccessDeniedError} from '@apps/base/errors'

class Edit extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {
            id,
            name,
            text,
            tags,
        } = params
        const {id: loggedInUserId} = user

        const checkAuthor = await this.query('checkAuthor', {
            id,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        if (!checkAuthor) {
            throw new AccessDeniedError('You cannot edit idea that not belongs to you')
        }

        const ideaId = await this.query('edit', {
            id,
            name,
            text,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        await this.query('deleteTags', {
            id,
            tags,
        })

        return {
            id: ideaId,
        }
    }
}

export default new Edit({
    name: 'edit',
})
