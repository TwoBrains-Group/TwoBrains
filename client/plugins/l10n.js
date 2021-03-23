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

    // timeAgo(ts) {
    //     const end = new Date()
    //     const diff = Math.floor(Math.abs((end.getTime() - ts.getTime()) / 1000))
    //
    //     let range = 's'
    //     let time = diff
    //     for (const [r, div] of Object.entries(dividers)) {
    //         time = diff / div
    //         if (time > 1) {
    //             time = Math.floor(time)
    //             range = r
    //             break
    //         }
    //     }
    //
    //     const rangeString = time > 1 ? `${this.timeL10N.ranges[range]}s` : this.timeL10N.ranges[range]
    //
    //     return `${time} ${rangeString} ${this.ctx}`
    // }
    //
    // prettyDate(date) {
    //     const y = date.getFullYear()
    //     const m = date.getMonth()
    //     const d = date.getDay()
    //
    //     const month = this.timeL10N.months[m]
    //     return `${d}/${month}, ${y}`
    // }
}

export default (ctx, inject) => {
    inject('l10n', new L10N(ctx))
}
