import {MethodRes} from '@apps/base/Method'
import {Req} from '@apps/base/templates'
import {AuthError} from '@apps/base/errors'
import {QueryReturnType} from '@modules/db/pool'
import BaseAuth from './base-auth'

class Login extends BaseAuth {
    async run(req: Req): Promise<MethodRes> {
        this.log.warn(`Got request: ${JSON.stringify(req, null, 2)}`)

        let {email} = req.params
        const {password} = req.params

        email = email.toLowerCase()

        const userId = await this.query('getUserByEmail', {
            email,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'userId',
        })

        if (!userId) {
            throw new AuthError(`User with email '${email}' not found`)
        }

        const passwordVerified = await this.query('verifyPassword', {
            password,
            userId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'passwordVerified',
        })

        if (!passwordVerified) {
            throw new AuthError('Invalid password')
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
