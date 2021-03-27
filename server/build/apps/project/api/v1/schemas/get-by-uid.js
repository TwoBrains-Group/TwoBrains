"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'userUid',
        'uid',
    ],
    properties: {
        userUid: {
            type: 'string',
        },
        uid: {
            type: 'string',
        },
    },
};
