import {AppProps, BaseApp} from '@apps/base'
import express from 'express'
import jwt from 'express-jwt'
// import jsonwebtoken from 'jsonwebtoken'

class Auth extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    async _init(expApp: express.Application): Promise<void> {
        expApp.get('/auth/google/callback', (req, res) => {
            this.log.info(`Data: ${JSON.stringify(req.query)}`)

            res.json(req.query)
        })

        // expApp.use(jwt({
        //     secret: process.env.JWT_SECRET,
        //     algorithms: ['HS256'],
        // }).unless({
        //     path: ['/auth/login']
        // }))
    }
}

export default new Auth({
    routePrefix: '/auth'
})
