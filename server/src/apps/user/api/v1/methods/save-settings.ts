import {Method, MethodProps, MethodRes, Req, Res} from '@apps/base/Method'
import {QueryReturnType} from "@modules/db/Pool";

class SaveSettings extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, user: any): Promise<MethodRes> {
        const {params} = req
        const {id} = user
        const {nickname, password} = params
        let {uid} = params

        if (uid) {
            uid = uid.replace(/ /, '')
        }

        const updatedData = await this.query('updateUser', {id, nickname, password, uid}, {
            returnType: QueryReturnType.Row,
            unusedToNull: ['uid', 'nickname', 'avatar', 'password'],
            queryDebugLog: true,
        })

        return {
            result: updatedData,
        }
    }
}

export default new SaveSettings({
    route: 'saveSettings',
})
