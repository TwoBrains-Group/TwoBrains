export class BaseError extends Error {
    code: number
    message: string
    data: Record<string, any>

    constructor(message: string, code = -32000, data = {}) {
        super(message)

        this.code = code || -32000
        this.message = message
        this.data = data || {}
    }
}

const prepareSchemaError = (errors: any[]) => errors.reduce((acc: string, el: any) => {
    return acc + `'${el.dataPath.replace(/\//, '')}' ${el.message},\n`
}, '')

export class InvalidParams extends BaseError {
    constructor(errors: any[] | string = 'Invalid params') {
        super(Array.isArray(errors) ? prepareSchemaError(errors) : errors)
    }
}

export class MethodNotFound extends BaseError {
    constructor(message = 'Method not found') {
        super(message, -32601, {})
    }
}

export class AuthError extends BaseError {
    constructor(message = 'Authentication error') {
        super(message, -32002, {})
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized') {
        super(message, -32001, {})
    }
}
