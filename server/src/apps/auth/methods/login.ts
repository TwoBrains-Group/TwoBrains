import {Method, MethodProps} from '@apps/base/Method'
import {Req, Res} from '@apps/base/templates'

class Login extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req): Promise<Res> {
        return {
            result: {}
        }
    }
}

export default new Login({
    route: 'login'
})
