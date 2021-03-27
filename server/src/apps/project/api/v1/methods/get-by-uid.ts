import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareProject} from '../modules/prepare'

class GetByUid extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {
            userUid,
            uid,
        } = params
        const {id: loggedInUserId} = user

        const project = await this.query('getProjectByUid', {
            userUid,
            uid,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
        })

        prepareProject(project)

        return {
            project,
        }
    }
}

export default new GetByUid({
    name: 'getByUid',
})
