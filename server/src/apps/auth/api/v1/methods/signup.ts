import {MethodProps, Req, Res} from '@apps/base/Method'
import {QueryReturnType} from "@modules/db/Pool";
import {InvalidParams, MethodError} from "@apps/base/errors";
import {nanoid} from 'nanoid'
import BaseAuth from './base-auth'

type Schema = {
    email: string
    password: string
    repeatPassword: string
}

const specialChars = '@#$%^&+=~'
const checkPassword = (pwd: string) => pwd.match(/^(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~]).*$/g)

const defaultAvatar = 'default.png'

class Signup extends BaseAuth {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req): Promise<Res> {
        let {email, password, repeatPassword}: Schema = req.params

        email = email.toLowerCase()

        if (email.length > 320) {
            throw new InvalidParams('email must be less than 320 characters long')
        }

        if (password !== repeatPassword) {
            throw new InvalidParams('passwords does not match')
        }

        if (!checkPassword(password)) {
            throw new InvalidParams(`password must be more than 8 characters long, contain at least one lowercase and uppercase letter, and at least one of special characters: ${specialChars.split('').join(', ')}. For your security 😄`)
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
