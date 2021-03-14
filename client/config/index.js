import messages from '../l10n'

export const i18n = {
    locales: [
        {
            code: 'en',
            iso: 'en-US',
            name: 'English',
        },
        {
            code: 'ru',
            iso: 'ru-RU',
            name: 'Русский',
        },
    ],
    strategy: 'no_prefix',
    defaultLocale: 'en',
    vueI18n: {
        fallbackLocale: 'en',
        messages,
    },
}
