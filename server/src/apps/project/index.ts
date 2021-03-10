import {AppProps, BaseApp} from '@apps/base'

class Project extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }
}

export default new Project({
    routePrefix: 'project',
})
