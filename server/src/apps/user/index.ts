import {BaseApp, AppProps} from '@apps/_base'

class User extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new User({
    name: 'user',
})
