import {Method, MethodProps, MethodRes} from '@apps/base/Method'
import {Req, Res} from '@apps/base/templates'
import {InvalidParams, MethodError} from '@apps/base/errors'
import {QueryReturnType} from '@modules/db/Pool'
import jwt from 'jsonwebtoken'
import BaseAuth from './base-auth'

type Schema = {
    email: string
    password: string
}

class Login extends BaseAuth {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req): Promise<MethodRes> {
        this.log.warn(`Got request: ${JSON.stringify(req, null, 2)}`)

        let {email, password}: Schema = req.params

        email = email.toLowerCase()

        const userId = await this.query('getUserByEmail', {email}, {
            returnType: QueryReturnType.Row,
            returnField: 'userId',
        })

        if (!userId) {
            throw new MethodError(`User with email '${email}' not found`)
        }

        const passwordVerified = await this.query('verifyPassword', {password, userId}, {
            returnType: QueryReturnType.Row,
            returnField: 'passwordVerified',
        })

        if (!passwordVerified) {
            throw new MethodError(`Invalid password`)
        }

        const {token, userData} = await this.getToken(userId)

        return {
            result: {
                userData,
            },
            token,
        }
    }
}

export default new Login({
    route: 'login',
})
