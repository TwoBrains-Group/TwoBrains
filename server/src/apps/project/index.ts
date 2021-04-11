import {AppProps, BaseApp} from '@apps/_base'

class Project extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new Project({
    name: 'project',
})
