"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        ids: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        group: {
            type: 'string',
        },
    },
};