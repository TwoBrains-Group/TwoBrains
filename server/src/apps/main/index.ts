import {BaseApp, AppProps} from '@apps/base'

class Main extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new Main({
    name: 'main',
})
