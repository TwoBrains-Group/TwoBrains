// import VueI18n from 'vue-i18n'
// import {Api} from './api'
//
// export default async (ctx) => {
//     const api = new Api(ctx)
//
//     const getMessages = async locale => {
//         return await api.send({
//             app: 'l10n',
//             method: 'load',
//             params: {
//                 locale,
//             },
//             v: 1,
//         })
//     }
//
//     ctx.app.i18n = new VueI18n({ //construction a new VueI18n
//         locale: ctx.store.state.i18n.locale,
//         fallbackLocale: 'en',
//         messages: {
//             'en': await getMessages('en'),
//             'ru': await getMessages('ru'),
//         },
//     })
// }
