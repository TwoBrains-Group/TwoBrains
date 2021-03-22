"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        labels: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        ids: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        groupIds: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        groupLabels: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
};
