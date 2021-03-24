import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class GetList extends Method {
    async run(req: Req): Promise<MethodRes> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {params} = req

        const plugins = await this.query('getList', {}, {
            returnType: QueryReturnType.Rows,
        })

        return {
            plugins,
        }
    }
}

export default new GetList({
    name: 'getList',
})
