import {Method, MethodRes, Req} from "@apps/base/Method";

class UpdateAvatar extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {

    }
}

export default new UpdateAvatar({
    route: 'updateAvatar',
})
