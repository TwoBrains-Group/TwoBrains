import {i18n} from './config'

export default {
    // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
    ssr: true,

    server: {
        port: 8080,
    },

    transpileDependencies: ['vuex-persist'],

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        bodyAttrs: {
            class: 'sb',
        },
        title: 'TwoBrains',
        meta: [
            {
                charset: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: '',
            },
        ],
        link: [
            {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css',
            },
            {
                rel: 'icon',
                type: 'image/png',
                href: '/img/favicon.png',
            },
        ],
        script: [
            // {src: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.runtime.esm-browser.js'}
        ],
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        '~/assets/sass/common/common',
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '~/plugins/api.js',
        '~/plugins/tooltip.js',
        '~/plugins/l10n.js',
        {
            src: '~/plugins/vuex-persistedstate.js',
            ssr: false,
        },
    ],
    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/dotenv',
        '@nuxtjs/toast',
        'nuxt-i18n',
    ],

    i18n,

    loading: {
        color: '#f25959aa',
        height: '3px',
        continuous: true,
        duration: '0.5s',
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        parallel: true,
        cache: true,
    },

    router: {
        middleware: [],
        routes: [
            {
                name: 'home',
                path: '/',
                component: 'pages/index.vue',
            },
            {
                name: 'home',
                path: '/profile',
                component: 'pages/user/profile.vue',
            },
            {
                name: 'user-uid',
                path: '/user/:uid',
                component: 'pages/user/index.vue',
            },
            {
                name: 'auth-login',
                path: '/auth/login',
                component: 'pages/auth/index.vue',
            },
        ],
    },

    axios: {
        proxy: true,
        baseURL: process.env.API_URI,
    },

    toast: {
        position: 'bottom-right',
        duration: 5000,
        className: 'ui-toast',
    },
}
