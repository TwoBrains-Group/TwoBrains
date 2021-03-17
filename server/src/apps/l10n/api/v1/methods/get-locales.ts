import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

class GetLocales extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {translatable} = params

        const locales = await this.query('getLocales', {
            translatable,
        }, {
            returnType: QueryReturnType.Rows,
        })

        return {
            locales,
        }
    }
}

export default new GetLocales({
    name: 'getLocales',
})
