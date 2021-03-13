import {NextFunction, Request, Response} from 'express'
import {MethodError} from '@apps/base/errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: MethodError, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err)
    }

    res.json({
        error: {
            code: err.code,
            message: err.message,
            data: err.data,
        },
    })

    // next(err)
}
