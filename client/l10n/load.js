import {Api} from '@/plugins/api'

export default async (ctx, locale) => {
    const api = new Api(ctx)

    const {data} = await api.send({
        app: 'l10n',
        method: 'load',
        params: {
            locale,
        },
        v: 1,
    })

    return data
}
