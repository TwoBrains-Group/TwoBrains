import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

const prepareName = (name: string) => {
    return name.trim()
}

const prepareText = (text: string) => {
    return text.trim()
}

class Create extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        let {
            name,
            text,
        } = params
        const {id: userId} = user

        name = prepareName(name)
        text = prepareText(text)

        const id = await this.query('create', {
            name,
            text,
            userId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        return {
            id,
        }
    }
}

export default new Create({
    name: 'create',
})
