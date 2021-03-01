import {Method, MethodProps, MethodRes, Req, Res} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/Pool'
import {MethodError} from "@apps/base/errors";

class GetByUid extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req): Promise<MethodRes> {
        const {uid} = req.params

        const user = await this.query('getUserByUid', {uid}, {
            returnType: QueryReturnType.Row,
            queryDebugLog: true,
        })

        if (!user) {
            throw new MethodError('User not found')
        }

        return {
            user,
        }
    }
}

export default new GetByUid({
    route: 'getByUid'
})
