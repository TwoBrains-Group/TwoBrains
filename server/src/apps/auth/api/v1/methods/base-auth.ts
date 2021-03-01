import {Method, MethodProps} from '@apps/base/Method'
import jwt from "jsonwebtoken";
import {QueryReturnType} from "@modules/db/Pool";
import {MethodError} from "@apps/base/errors";

type getTokenResult = {
    token: string
    userData: object
}

class BaseAuth extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async getToken(userId: number): Promise<getTokenResult> {
        // TODO: Move JWT logic to module or base method
        const userData: any = await this.query('getUserData', {userId}, {
            returnType: QueryReturnType.Row,
        })

        if (userData.blocked) {
            throw new MethodError('This user is blocked')
        }

        if (userData.deleted) {
            throw new MethodError('This user is deleted')
        }

        const token = jwt.sign({userData}, Buffer.from(process.env.JWT_SECRET!, 'base64'), {algorithm: 'HS256'})

        return {
            token,
            userData,
        }
    }
}

export default BaseAuth
