import {AuthUser, Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareProject} from '../modules/prepare'

const DEFAULT_TAGS_LIMIT = 10

class GetByUid extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {
            userUid,
            uid,
            tagsLimit = DEFAULT_TAGS_LIMIT,
        } = params
        const {id: loggedInUserId} = user

        const project = await this.query('getProjectByUid', {
            userUid,
            uid,
            loggedInUserId,
            tagsLimit,
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
