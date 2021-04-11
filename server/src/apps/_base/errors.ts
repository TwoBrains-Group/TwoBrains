import {ErrorObject} from 'ajv'

type ErrorData = Record<string, any>

const prepareSchemaError = (errors: any[]) => errors.reduce((acc: string[], el: any) => {
    acc.push(`'${el.dataPath.replace(/\//, '')}' ${el.message}`)
    return acc
}, []).join('\n')

const ERROR_CODES = {
    PARSE_ERROR: -32700,
    INVALID_REQUEST: -32600,
    METHOD_NOT_FOUND: -32601,
    INVALID_PARAMS: -32602,
    INTERNAL_ERROR: -32603,

    UNKNOWN: -32000,

    UNAUTHORIZED: -32001,
    NOT_FOUND: -32002,
    ACCESS_DENIED: -32003,
}

/**
 * BaseError
 * Superclass for all registered errors
 */
export class BaseError extends Error {
    name: string
    message: string
    code: number
    data: ErrorData

    constructor(message: string, code = -32000, data: ErrorData = {}) {
        super(message)

        this.message = message
        this.name = this.constructor.name
        this.code = code || ERROR_CODES.UNKNOWN
        this.data = data || {}
    }
}

/**
 * InvalidRequest
 * @description Thrown when got request in invalid structure (data outside of `params` object is not valid)
 */
export class InvalidRequest extends BaseError {
    constructor(message: string, data: ErrorData = {}) {
        super(message, ERROR_CODES.INVALID_REQUEST, data)
    }
}

/**
 * MethodNotFound
 * @description Thrown when specified app/method not found
 */
export class MethodNotFound extends BaseError {
    constructor(message = 'Method not found', data: ErrorData = {}) {
        super(message, ERROR_CODES.METHOD_NOT_FOUND, data)
    }
}

/**
 * InvalidParams
 * @description Thrown when invalid params were given
 */
export class InvalidParams extends BaseError {
    constructor(errors?: ErrorObject[] | null | string) {
        super(Array.isArray(errors) ? prepareSchemaError(errors) : 'Invalid params', ERROR_CODES.INVALID_PARAMS, {
            errors,
        })
    }
}

/**
 * InternalError
 * @description Thrown when something went wrong and no specific error was specified
 *  or something must be hidden from user
 */
export class InternalError extends BaseError {
    constructor(message = 'Internal error', data: ErrorData = {}) {
        super(message, ERROR_CODES.INTERNAL_ERROR, data)
    }
}

/**
 * UnauthorizedError
 * @description Thrown when method requires authentication but no jwt token were given
 */
export class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized', data: ErrorData = {}) {
        super(message, ERROR_CODES.UNAUTHORIZED, data)
    }
}

/**
 * NotFoundError
 * @description Thrown when some data was not found
 */
export class NotFoundError extends BaseError {
    constructor(message = 'Not found', data: ErrorData = {}) {
        super(message, ERROR_CODES.NOT_FOUND, data)
    }
}

/**
 * AccessDeniedError
 * @description Thrown when some instructions cannot be applied due to user's rights
 */
export class AccessDeniedError extends BaseError {
    constructor(message = 'Access denied', data: ErrorData = {}) {
        super(message, ERROR_CODES.ACCESS_DENIED, data)
    }
}
