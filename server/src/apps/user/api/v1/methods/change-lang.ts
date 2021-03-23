import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {BaseError} from '@apps/base/errors'

class ChangeLang extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params} = req
        const {locale} = params
        const {id} = user

        const newLocale = await this.query('changeLang', {
            id,
            locale,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'locale',
        })

        if (!newLocale) {
            throw new BaseError('Locale not found')
        }

        return {
            locale: newLocale,
        }
    }
}

export default new ChangeLang({
    name: 'changeLang',
})
