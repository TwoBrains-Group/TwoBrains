import {InternalError} from '@apps/base/errors'

export class DBError extends InternalError {
    fatal: boolean

    constructor(message: string, fatal = true) {
        super()
        this.message = message
        this.fatal = fatal
    }

    hide(): this {
        if (process.env.ENV === 'prod') {
            this.message = 'Oops... Something went wrong'
        }
        return this
    }
}

export class UnusedQueryParams extends DBError {
    constructor(list: string[], queryName: string) {
        super(`Query preparation (${queryName}): Unused query params found: ${JSON.stringify(list, null, 2)}`)
    }
}

