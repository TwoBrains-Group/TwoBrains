import {BaseApp, AppProps} from '@apps/base'

class User extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new User({
    routePrefix: '/user'
})
