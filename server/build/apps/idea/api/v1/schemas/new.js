"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'name',
        'text',
    ],
    properties: {
        name: {
            type: 'string',
            minLength: 12,
        },
        text: {
            type: 'string',
            minLength: 35,
        },
    },
};
