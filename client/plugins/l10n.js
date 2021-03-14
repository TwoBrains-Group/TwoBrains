/**
 * Localization helper class
 */
class L10N {
    constructor(ctx) {
        this.ctx = ctx
    }

    format(template, params) {
        return template.replace(/{(.+?)}/g, (m, name) => params[name])
    }
}

export default (ctx, inject) => {
    inject('l10n', new L10N(ctx))
}
