"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@apps/base/errors");
exports.default = (err, req, res, next) => {
    res.type('json');
    const error = new errors_1.MethodNotFound();
    !res.headersSent && res.type('json').status(200).send(error);
};
