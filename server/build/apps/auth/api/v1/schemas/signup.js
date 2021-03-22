"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("@utils/data");
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'email',
        'password',
        'repeatPassword',
    ],
    properties: {
        email: {
            type: 'string',
            pattern: data_1.emailPatternString,
        },
        password: {
            type: 'string',
            pattern: data_1.passwordPatternString,
        },
        repeatPassword: {
            type: 'string',
            pattern: data_1.passwordPatternString,
        },
    },
};
