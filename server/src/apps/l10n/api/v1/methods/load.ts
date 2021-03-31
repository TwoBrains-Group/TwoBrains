import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class Load extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {locale} = params

        const cmp = await this.query('loadComponents', {
            locale,
        }, {
            returnType: QueryReturnType.Rows,
            returnField: 'data',
        })

        const page = await this.query('loadPages', {
            locale,
        }, {
            returnType: QueryReturnType.Rows,
            returnField: 'data',
        })

        return {
            cmp,
            page,
        }
    }
}

export default new Load({
    name: 'load',
})
