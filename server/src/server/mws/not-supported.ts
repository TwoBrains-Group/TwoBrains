import {MethodNotFound} from '@apps/_base/errors'
import {NextFunction, Request, Response} from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    const error = new MethodNotFound()
    !res.headersSent && res.type('json').status(200).send({
        error,
    })

    // next(err)
}
