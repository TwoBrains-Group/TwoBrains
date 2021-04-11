import {AuthUser, Method, MethodProps, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {BaseError} from '@apps/_base/errors'
import {prepareFollowingStatus} from '../modules/prepare-user'

class GetByUid extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, loggedInUser: AuthUser): Promise<MethodRes> {
        const {uid} = req.params
        const {id: loggedInUserId} = loggedInUser

        const user = await this.query('getUserByUid', {
            uid,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
        })

        if (!user) {
            throw new BaseError('User not found')
        }

        prepareFollowingStatus(user)

        user.isMe = user.id === loggedInUserId

        return {
            user,
        }
    }
}

export default new GetByUid({
    name: 'getByUid',
})
