import {Method, MethodProps} from '@apps/base/Method'

class Create extends Method {
    constructor(props: MethodProps) {
        super(props)
    }
}

export default new Create({
    route: 'create',
})
