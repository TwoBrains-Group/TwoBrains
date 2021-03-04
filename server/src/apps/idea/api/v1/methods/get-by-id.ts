import {Method, MethodProps, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/Pool'

class GetById extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, user?: any) : Promise<MethodRes> {
        const {params: {id}} = req
        const {id: loggedInUserId} = user

        const idea = await this.query('getById', {id, loggedInUserId}, {
            returnType: QueryReturnType.Row,
        })

        return {idea}
    }
}

export default new GetById({
    route: 'getById',
})
