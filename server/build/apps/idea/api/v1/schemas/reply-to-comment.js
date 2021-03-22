"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'replyTo',
        'text',
    ],
    properties: {
        replyTo: {
            type: 'string',
        },
        text: {
            type: 'string',
        },
    },
};
