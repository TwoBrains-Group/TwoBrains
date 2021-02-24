import {AppProps, BaseApp} from '@apps/base'
import express, {NextFunction, Request, Response, Errback} from 'express'
import jwt from 'express-jwt'

class Auth extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    async _init(expApp: express.Application): Promise<void> {
        expApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err.name === 'UnauthorizedError') {
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                })
            }
        })

        // expApp.use(jwt({
        //     algorithms: ['HS256'],
        //     secret: Buffer.from(process.env.JWT_SECRET, 'base64'),
        //     getToken: req => {
        //         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        //             return req.headers.authorization.split(' ')[1]
        //         } else if (req.query && req.query.token) {
        //             return req.query.token
        //         } else if (req.cookies && req.cookies.token) {
        //             return req.cookies.token
        //         }
        //         return null
        //     },
        // }).unless({
        //     path: [
        //         /.*\/auth.*/g
        //     ]
        // }))
    }
}

export default new Auth({
    routePrefix: '/auth'
})
