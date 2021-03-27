import {NextFunction, Request, Response} from 'express'
import {BaseError} from '@apps/base/errors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof BaseError) {
        !res.headersSent
        && res.type('json').status(200).send({
            error: {
                code: err.code,
                message: err.message,
                data: err.data,
            },
        })
    }

    // FIXME: Add "unknown error" handling
    console.log('UNKNOWN ERROR:', err)
}
