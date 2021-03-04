import {Method, MethodRes, Req} from "@apps/base/Method";
import {QueryReturnType} from "@modules/db/Pool";

const DEFAULT_LIMIT = 10

class GetList extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params: {
            offset = 0,
            limit = DEFAULT_LIMIT,
        }} = req

        const {id: loggedInUserId} = user

        const ideas = await this.query('getList', {offset, limit, loggedInUserId}, {
            returnType: QueryReturnType.Rows,
        })

        return {ideas}
    }
}

export default new GetList({
    route: 'getList',
})
