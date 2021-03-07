import {Method, MethodProps, MethodRes, Req} from "@apps/base/Method";
import {QueryReturnType} from "@modules/db/Pool";

class Component extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params} = req
        const {
            name,
            appName = '*',
        } = params

        const data = await this.query('getComponentData', {
            name,
            appName,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'data',
        })

        return {data}
    }
}

export default new Component({
    route: 'component',
})
