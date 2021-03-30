import {Api} from '@/plugins/api'

export default async (ctx, locale) => {
    const api = new Api(ctx)

    return await api.send({
        app: 'l10n',
        method: 'load',
        params: {
            locale,
        },
        v: 1,
    })
}
