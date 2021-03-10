import {Api} from './api.client'
import Vue from 'vue'

const LOCALE_KEY = 'l10n_locale'
const DEFAULT_LOCALE = 'en'
const componentRequiredFields = ['l10n', 'app', 'page']
const pageRequiredFields = ['l10n', 'app']
const l10nTypes = ['components', 'pages']

const s = JSON.stringify
const p = JSON.parse
const cmpKey = (app, page, name) => `${app}_${page}_${name}`
const pageKey = (app, name) => `${app}_${name}`

class L10N {
    constructor(ctx, api) {
        this.ctx = ctx
        this.api = api

        this.locale = null
        this.data = {}

        this.components = {}
        this.pages = {}
        this.componentsNames = []
        this.pagesNames = []

        this._init()
    }

    lk(l) {
        return `l10n_${l || this.locale}`
    }

    _init() {
        if (!localStorage.getItem(LOCALE_KEY)) {
            localStorage.setItem(LOCALE_KEY, DEFAULT_LOCALE)
        }

        this.locale = localStorage.getItem(LOCALE_KEY)

        const lsData = p(localStorage.getItem(this.lk()))

        if (!lsData) {
            localStorage.setItem(this.lk(), '{}')
        }

        this.data = p(localStorage.getItem(this.lk()))

        for (const type of l10nTypes) {
            if (!this.data[type]) {
                this.data[type] = {}
            }
        }

        // window.onload = async () => {
        //     console.log(`WINDOW ONLOAD\n\n\n`)
        //     await this.load()
        // }
    }

    writeData(data) {
        this.data = {...this.data, ...data}
        localStorage.setItem(this.lk(), s(this.data))

        console.log('Write data', s(this.data))
    }

    setLocale(locale) {
        this.locale = locale
        localStorage.setItem(LOCALE_KEY, this.locale)

        this.data = p(localStorage.getItem(this.lk()))
    }

    getComponentCache(l10nFields, app, page, name) {
        const cmpCache = this.data.components[cmpKey(app, page, name)]

        if (!cmpCache) {
            return null
        }

        for (const field of l10nFields) {
            if (!cmpCache[field]) {
                return null
            }
        }

        return cmpCache
    }

    getPageCache(l10nFields, app, name) {
        const pageCache = this.data.pages[pageKey(app, name)]

        if (!pageCache) {
            return null
        }

        for (const field of l10nFields) {
            if (!pageCache[field]) {
                return null
            }
        }

        return pageCache
    }

    component(cmp) {
        if (!(cmp instanceof Vue)) {
            throw new Error('Component must be instance of Vue')
        }

        const name = cmp.$options.name

        if (!name) {
            throw new Error('Component must have \'name\' field in $options')
        }

        for (const field of componentRequiredFields) {
            if (!cmp[field]) {
                throw new Error(`Component must have '${field}' field in data`)
            }
        }

        const app = cmp.app
        const page = cmp.page
        const l10nFields = Object.keys(cmp.l10n)

        const cache = this.getComponentCache(l10nFields, app, page, name)

        if (cache) {
            cmp.l10n = cache
            cmp.l10nLoaded = true
            return
        }

        this.componentsNames.push({app, page, name})
        this.components[cmpKey(app, page, name)] = cmp
    }

    page(page) {
        if (!(page instanceof Vue)) {
            throw new Error('Page must be instance of Vue')
        }

        const name = page.$options.name

        if (!name) {
            throw new Error('Page must have \'name\' field in $options')
        }

        for (const field of pageRequiredFields) {
            if (!page[field]) {
                throw new Error(`Page must have '${field}' field in data`)
            }
        }

        const app = page.app
        const l10nFields = Object.keys(page.l10n)

        const cache = this.getPageCache(l10nFields, app, name)

        if (cache) {
            page.l10n = cache
            page.l10nLoaded = true
            return
        }

        this.pagesNames.push({app, name})
        this.pages[pageKey(app, name)] = page
    }

    async load() {
        if (!Object.keys(this.components).length && !Object.keys(this.pages).length) {
            return
        }

        const params = {
            components: this.componentsNames,
            pages: this.pagesNames,
            locale: this.locale,
        }

        const {data} = await this.api.send({
            app: 'l10n',
            method: 'load',
            params,
            v: 1,
        })

        const updatedComponents = {}
        for (const [key, cmpData] of Object.entries(data.components)) {
            updatedComponents[key] = cmpData
            this.components[key].l10n = cmpData
            this.components[key].l10nLoaded = true
        }

        this.writeData({
            components: {
                ...this.data.components,
                ...updatedComponents,
            },
        })

        const updatedPages = {}
        for (const [key, pageData] of Object.entries(data.pages)) {
            updatedPages[key] = pageData
            this.pages[key].l10n = pageData
            this.pages[key].l10nLoaded = true
        }

        this.writeData({
            pages: {
                ...this.data.pages,
                ...updatedPages,
            },
        })
    }
}

export default (ctx, inject) => {
    // FIXME: Fckn strange hack!
    const api = new Api(ctx)
    inject('l10n', new L10N(ctx, api))
}
