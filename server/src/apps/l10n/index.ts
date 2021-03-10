import {AppProps, BaseApp} from '@apps/base'

class L10N extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new L10N({
    routePrefix: 'l10n',
})
