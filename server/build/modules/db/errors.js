"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnusedQueryParams = exports.DBError = void 0;
class DBError extends Error {
    constructor(message, fatal = true) {
        super();
        this.message = message;
        this.fatal = fatal;
    }
    hide() {
        if (process.env.ENV === 'prod') {
            this.message = 'Oops... Something went wrong';
        }
        return this;
    }
}
exports.DBError = DBError;
class UnusedQueryParams extends DBError {
    constructor(list, queryName) {
        super(`Query preparation (${queryName}): Unused query params found: ${JSON.stringify(list, null, 2)}`);
    }
}
exports.UnusedQueryParams = UnusedQueryParams;
