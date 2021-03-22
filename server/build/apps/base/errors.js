"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = exports.MethodNotFound = exports.InvalidParams = exports.MethodError = void 0;
class MethodError extends Error {
    constructor(message, code = -32000, data = {}) {
        super(message);
        this.code = code || -32000;
        this.message = message;
        this.data = data || {};
    }
}
exports.MethodError = MethodError;
const prepareSchemaError = (errors) => errors.reduce((acc, el) => {
    return acc + `'${el.dataPath.replace(/\//, '')}' ${el.message},\n`;
}, '');
class InvalidParams extends MethodError {
    constructor(errors = 'Invalid params') {
        super(Array.isArray(errors) ? prepareSchemaError(errors) : errors);
    }
}
exports.InvalidParams = InvalidParams;
class MethodNotFound extends MethodError {
    constructor(message = 'Method not found') {
        super(message, -32601, {});
    }
}
exports.MethodNotFound = MethodNotFound;
class AuthError extends MethodError {
    constructor(message = 'Authentication error') {
        super(message, -32002, {});
    }
}
exports.AuthError = AuthError;
