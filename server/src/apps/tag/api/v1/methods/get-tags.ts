import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class GetTags extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {
            ids,
            labels,
            groupIds,
            groupLabels,
        } = params

        const tags = await this.query('getList', {
            ids,
            labels,
            groupIds,
            groupLabels,
        }, {
            returnType: QueryReturnType.Rows,
            queryDebugLog: true,
        })

        return {
            tags,
        }
    }
}

export default new GetTags({
    name: 'getTags',
})
