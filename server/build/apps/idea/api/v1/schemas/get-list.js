"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        offset: {
            type: 'number',
        },
        limit: {
            type: 'number',
        },
        relation: {
            anyOf: [{
                    enum: ['project', 'user'],
                    default: 'user',
                }, {
                    type: 'null',
                }],
        },
        userUid: {
            type: 'string',
        },
        tagsLimit: {
            type: 'number',
        },
    },
};