import {MethodProps, MethodRes, Req, Res} from '@apps/base/Method'
import {QueryReturnType} from "@modules/db/Pool";
import {InvalidParams, MethodError} from "@apps/base/errors";
import {nanoid} from 'nanoid'
import BaseAuth from './base-auth'
import {passwordPattern, passwordSpecialChars} from "@utils/data";

type Schema = {
    email: string
    password: string
    repeatPassword: string
}

const defaultAvatar = 'default.png'

class Signup extends BaseAuth {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req): Promise<MethodRes> {
        let {email, password, repeatPassword}: Schema = req.params

        email = email.toLowerCase()

        if (password !== repeatPassword) {
            throw new InvalidParams('passwords does not match')
        }

        const userExists = await this.query('getUserByEmail', {email}, {
            returnType: QueryReturnType.Row,
            returnField: 'userId'
        })

        if (userExists) {
            throw new MethodError(`User with email '${email}' already exists`)
        }

        const nickname = email.split('@')[0]
        const uid = `${nickname}_${nanoid(8)}`
        const avatar = defaultAvatar

        const userId = await this.query('createUser', {
            email,
            password,
            nickname,
            uid,
            avatar,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'userId',
        })

        const {token, userData} = await this.getToken(userId)

        return {
            token,
            result: {
                userData,
            }
        }
    }
}

export default new Signup({
    route: 'signup'
})