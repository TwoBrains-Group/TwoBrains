import {AuthUser, Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareFollowingStatus} from '../modules/prepare-user'

class Follow extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {id} = params
        const {id: loggedInUserId} = user

        const following = await this.query('isFollowing', {
            id,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'following',
        })

        const queryName = following ? 'unfollow' : 'follow'
        await this.query(queryName, {
            id,
            loggedInUserId,
        })

        const info = await this.query('getFollowingStatus', {
            id,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
        })

        prepareFollowingStatus(info)

        return {
            info,
        }
    }
}

export default new Follow({
    name: 'follow',
})
