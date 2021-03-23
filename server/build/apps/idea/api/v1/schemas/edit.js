"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
        id: {
            type: 'string',
        },
        name: {
            type: 'string',
            minLength: 12,
        },
        text: {
            type: 'string',
            minLength: 35,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
};
