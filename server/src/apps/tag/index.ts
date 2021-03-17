import {AppProps, BaseApp} from '@apps/base'

class Tag extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new Tag({
    name: 'tag',
})
