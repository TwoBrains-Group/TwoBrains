import {AppProps, BaseApp} from '@apps/_base'

class Idea extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new Idea({
    name: 'idea',
})
