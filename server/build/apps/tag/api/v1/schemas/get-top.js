"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        group: {
            type: 'string',
        },
        count: {
            type: 'number',
            default: 10,
        },
    },
};
