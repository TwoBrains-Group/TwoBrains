import {Method, MethodProps} from '@apps/_base/Method'
import jwt from 'jsonwebtoken'
import {QueryReturnType} from '@modules/db/pool'
import {BaseError} from '@apps/_base/errors'

type getTokenResult = {
    token: string
    userData: Record<string, unknown>
}

class BaseAuth extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async getToken(userId: number): Promise<getTokenResult> {
        // TODO: Move JWT logic to module or api method
        const userData: Record<string, unknown> = await this.query('getUserData', {
            userId,
        }, {
            returnType: QueryReturnType.Row,
        })

        if (userData.deleted) {
            throw new BaseError('This user is deleted')
        }

        const token = jwt.sign({
            userData,
        }, Buffer.from(process.env.JWT_SECRET!, 'base64'), {
            algorithm: 'HS256',
        })

        return {
            token,
            userData,
        }
    }
}

export default BaseAuth
