"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'uid',
    ],
    properties: {
        uid: {
            type: 'string',
        },
        offset: {
            type: 'number',
        },
        limit: {
            type: 'number',
        },
    },
};
