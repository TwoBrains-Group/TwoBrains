import jwt from 'express-jwt'

export const jwtMw = jwt({
    algorithms: ['HS256'],
    secret: new Buffer(process.env.JWT_SECRET, 'base64'),
})
