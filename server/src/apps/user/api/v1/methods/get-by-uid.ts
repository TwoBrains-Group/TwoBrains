import {AuthUser, Method, MethodProps, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {MethodError} from '@apps/base/errors'
import {prepareFollowingStatus} from '../modules/prepare-user'

class GetByUid extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, loggedInUser: AuthUser): Promise<MethodRes> {
        const {uid} = req.params
        const {id: loggedInUserId} = loggedInUser

        const user = await this.query('getUserByUid', {uid, loggedInUserId}, {
            returnType: QueryReturnType.Row,
        })

        if (!user) {
            throw new MethodError('User not found')
        }

        prepareFollowingStatus(user)

        user.isMe = user.id === loggedInUserId

        return {
            user,
        }
    }
}

export default new GetByUid({
    route: 'getByUid',
})
