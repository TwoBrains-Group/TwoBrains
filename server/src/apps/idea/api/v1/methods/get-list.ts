import {Method, MethodRes, Req} from "@apps/base/Method";
import {QueryReturnType} from "@modules/db/Pool";

const DEFAULT_LIMIT = 25

class GetList extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params: {
            offset = 0,
        }} = req

        const {id: loggedInUserId} = user

        const limit = DEFAULT_LIMIT

        const ideas = await this.query('getList', {offset, limit, loggedInUserId}, {
            returnType: QueryReturnType.Rows,
        })

        return {ideas}
    }
}

export default new GetList({
    route: 'getList',
})
