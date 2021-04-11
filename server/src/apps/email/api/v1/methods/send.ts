import {Method, MethodRes, Req} from '@apps/base/Method'

class Send extends Method {
    async run(req: Req, user: any): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user

        // Start from here 😺

        return {}
    }
}

export default new Send({
    name: 'send',
})
