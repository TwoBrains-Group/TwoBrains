"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'text',
        'ideaId',
    ],
    properties: {
        text: {
            type: 'string',
            minLength: 15,
        },
        ideaId: {
            type: 'string',
        },
    },
};
