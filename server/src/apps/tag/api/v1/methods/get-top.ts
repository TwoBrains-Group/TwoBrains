import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class GetTop extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {
            // type,
            group,
            count = 10,
        } = params

        const tags = await this.query('getTop', {
            // type,
            group,
            count,
        }, {
            returnType: QueryReturnType.Rows,
        })

        return  {
            tags,
        }
    }
}

export default new GetTop({
    name: 'getTop',
})
