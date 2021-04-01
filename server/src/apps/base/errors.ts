import {ErrorObject} from 'ajv'

export class BaseError extends Error {
    name: string
    message: string
    code: number
    data: Record<string, any>

    constructor(message: string, code = -32000, data = {}) {
        super(message)

        this.message = message
        this.name = this.constructor.name
        this.code = code || -32000
        this.data = data || {}
    }
}

const prepareSchemaError = (errors: any[]) => errors.reduce((acc: string[], el: any) => {
    acc.push(`'${el.dataPath.replace(/\//, '')}' ${el.message}`)
    return acc
}, []).join('\n')

export class InvalidParams extends BaseError {
    constructor(errors?: ErrorObject[] | null | string) {
        super(Array.isArray(errors) ? prepareSchemaError(errors) : 'Invalid params', -32602, {
            errors,
        })
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
