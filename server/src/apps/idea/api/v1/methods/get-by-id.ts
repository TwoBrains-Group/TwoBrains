import {Method, MethodProps, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {prepareIdea} from '../modules/prepare-ideas'

class GetById extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, user?: any) : Promise<MethodRes> {
        const {params: {id}} = req
        const {id: loggedInUserId} = user

        let idea = await this.query('getById', {id, loggedInUserId}, {
            returnType: QueryReturnType.Row,
        })

        idea = prepareIdea(idea)

        return {idea}
    }
}

export default new GetById({
    route: 'getById',
})
