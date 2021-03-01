import {Method, MethodProps, MethodRes, Req, Res} from '@apps/base/Method'
import {QueryReturnType} from "@modules/db/Pool";
import {InvalidParams} from '@apps/base/errors'

const specialChars = '@#$%^&+=~'
const checkPassword = (pwd: string) => pwd.match(/^(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~]).*$/g)

class SaveSettings extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, user: any): Promise<MethodRes> {
        const {params} = req
        const {nickname, password} = params
        const {id} = user

        if ('nickname' in params && (nickname.length > 64 || nickname.length === 0)) {
            throw new InvalidParams('Nickname must be less than 64 characters long and not empty')
        }

        if ('password' in params && !checkPassword(password)) {
            throw new InvalidParams(`password must be more than 8 characters long, contain at least one lowercase and uppercase letter, and at least one of special characters: ${specialChars.split('').join(', ')}. For your security 😄`)
        }

        await this.query('updateUser', {id, nickname, password}, {
            returnType: QueryReturnType.None,
            unusedToNull: ['uid', 'nickname', 'avatar', 'password'],
            queryDebugLog: true,
        })

        return {
            result: {},
        }
    }
}

export default new SaveSettings({
    route: 'saveSettings',
})
