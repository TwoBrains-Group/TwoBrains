import {Method, MethodProps} from '@apps/base/Method'
import {Req, Res} from '@apps/base/templates'

class Google extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req): Promise<Res> {
        this.log.info(`Request: ${JSON.stringify(req, null, 2)}`)

        return {
            result: {
                kek: 'lol'
            }
        }
    }
}

export default new Google({
    route: '/google/callback'
})
