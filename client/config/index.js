export const i18n = {
    locales: [
        {
            code: 'en',
            iso: 'en-US',
            name: 'English',
            file: 'load.js',
        },
        {
            code: 'ru',
            iso: 'ru-RU',
            name: 'Русский',
            file: 'load.js',
        },
    ],
    lazy: true,
    langDir: 'l10n/',
    strategy: 'no_prefix',
    defaultLocale: 'en',
    vueI18n: {
        fallbackLocale: 'en',
        silentFallbackWarn: true,
    },
}
