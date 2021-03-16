import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class GetByUid extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {uid} = params
        const {id: loggedInUserId} = user

        const project = await this.query('getProjectByUid', {
            uid,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
        })

        return {
            project,
        }
    }
}

export default new GetByUid({
    route: 'getByUid',
})
