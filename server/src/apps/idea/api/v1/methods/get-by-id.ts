import {Method, MethodProps, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/Pool'

class GetById extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req) : Promise<MethodRes> {
        const {params: {id}} = req

        const idea = await this.query('getById', {id}, {
            returnType: QueryReturnType.Row,
        })

        return {idea}
    }
}

export default new GetById({
    route: 'getById',
})
