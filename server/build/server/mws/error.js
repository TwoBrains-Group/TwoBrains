"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@apps/base/errors");
exports.default = (err, req, res, next) => {
    if (err instanceof errors_1.BaseError) {
        !res.headersSent
            && res.type('json').status(200).send({
                error: {
                    code: err.code,
                    message: err.message,
                    data: err.data,
                },
            });
    }
    console.log('ERROR:', err);
    next(err);
};
