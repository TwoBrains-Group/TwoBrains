"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDeniedError = exports.NotFoundError = exports.UnauthorizedError = exports.InternalError = exports.InvalidParams = exports.MethodNotFound = exports.InvalidRequest = exports.BaseError = void 0;
const prepareSchemaError = (errors) => errors.reduce((acc, el) => {
    acc.push(`'${el.dataPath.replace(/\//, '')}' ${el.message}`);
    return acc;
}, []).join('\n');
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
};
class BaseError extends Error {
    constructor(message, code = -32000, data = {}) {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
        this.code = code || ERROR_CODES.UNKNOWN;
        this.data = data || {};
    }
}
exports.BaseError = BaseError;
class InvalidRequest extends BaseError {
    constructor(message, data = {}) {
        super(message, ERROR_CODES.INVALID_REQUEST, data);
    }
}
exports.InvalidRequest = InvalidRequest;
class MethodNotFound extends BaseError {
    constructor(message = 'Method not found', data = {}) {
        super(message, ERROR_CODES.METHOD_NOT_FOUND, data);
    }
}
exports.MethodNotFound = MethodNotFound;
class InvalidParams extends BaseError {
    constructor(errors) {
        super(Array.isArray(errors) ? prepareSchemaError(errors) : 'Invalid params', ERROR_CODES.INVALID_PARAMS, {
            errors,
        });
    }
}
exports.InvalidParams = InvalidParams;
class InternalError extends BaseError {
    constructor(message = 'Internal error', data = {}) {
        super(message, ERROR_CODES.INTERNAL_ERROR, data);
    }
}
exports.InternalError = InternalError;
class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized', data = {}) {
        super(message, ERROR_CODES.UNAUTHORIZED, data);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends BaseError {
    constructor(message = 'Not found', data = {}) {
        super(message, ERROR_CODES.NOT_FOUND, data);
    }
}
exports.NotFoundError = NotFoundError;
class AccessDeniedError extends BaseError {
    constructor(message = 'Access denied', data = {}) {
        super(message, ERROR_CODES.ACCESS_DENIED, data);
    }
}
exports.AccessDeniedError = AccessDeniedError;
