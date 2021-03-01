import {Method, MethodProps, MethodRes, Req} from "@apps/base/Method";

class Create extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    // async run(req: Req, user?: any): Promise<MethodRes> {
    //     const {params} = req
    //     const {id: userId} = user
    //
    //     await this.query('create', {})
    //
    // }
}

export default new Create({
    route: 'create',
})
