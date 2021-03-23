import jwt from 'express-jwt'
import {UnauthorizedError} from '@apps/base/errors'
import {Request} from 'express'
import api from '@apps/base/api'

const unless = (req: Request) => {
    return !api.getMethod(req).auth
}

export default jwt({
    algorithms: ['HS256'],
    secret: Buffer.from(process.env.JWT_SECRET!, 'base64'),
    getToken: req => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1].trim()
        } else if (req.body.token) {
            return req.body.token
        }
        throw new UnauthorizedError()
    },
}).unless(unless)
