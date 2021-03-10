import {AppProps, BaseApp} from '@apps/base'
// import express, {Request, Response} from 'express'

class Auth extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    // async _init(expApp: express.Application): Promise<void> {
    //     expApp.use((err: Error, req: Request, res: Response) => {
    //         if (err.name === 'UnauthorizedError') {
    //             return res.status(403).send({
    //                 success: false,
    //                 message: 'No token provided.',
    //             })
    //         }
    //     })
    // }
}

export default new Auth({
    routePrefix: '/auth',
})
