import {Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'

class Load extends Method {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {locale} = params

        const cmp = await this.query('getComponentsL10n', {
            locale,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'data',
        })

        const page = await this.query('getPagesL10n', {
            locale,
        }, {
            returnType: QueryReturnType.Row,
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
    auth: false,
})
