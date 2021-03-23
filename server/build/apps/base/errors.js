"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.AuthError = exports.MethodNotFound = exports.InvalidParams = exports.BaseError = void 0;
class BaseError extends Error {
    constructor(message, code = -32000, data = {}) {
        super(message);
        this.name = this.constructor.name;
        this.code = code || -32000;
        this.message = message;
        this.data = data || {};
    }
}
exports.BaseError = BaseError;
const prepareSchemaError = (errors) => errors.reduce((acc, el) => {
    return acc + `'${el.dataPath.replace(/\//, '')}' ${el.message},\n`;
}, '');
class InvalidParams extends BaseError {
    constructor(errors = 'Invalid params') {
        super(Array.isArray(errors) ? prepareSchemaError(errors) : errors);
    }
}
exports.InvalidParams = InvalidParams;
class MethodNotFound extends BaseError {
    constructor(message = 'Method not found') {
        super(message, -32601, {});
    }
}
exports.MethodNotFound = MethodNotFound;
class AuthError extends BaseError {
    constructor(message = 'Authentication error') {
        super(message, -32002, {});
    }
}
exports.AuthError = AuthError;
class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized') {
        super(message, -32001, {});
    }
}
exports.UnauthorizedError = UnauthorizedError;
