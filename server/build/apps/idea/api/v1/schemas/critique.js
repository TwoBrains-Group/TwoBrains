"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: ['critique'],
    properties: {
        critique: {
            type: 'boolean',
            default: false,
        },
    },
};
