import {BaseApp, AppProps} from '@apps/base'

class Main extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export const main = new Main({
    routePrefix: '/'
})