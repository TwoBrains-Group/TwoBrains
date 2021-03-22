"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("@utils/data");
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        nickname: {
            type: 'string',
            minLength: 1,
            maxLength: 64,
        },
        password: {
            type: 'string',
            pattern: data_1.passwordPatternString,
        },
        uid: {
            type: 'string',
            minLength: 6,
            maxLength: 32,
        },
    },
};
