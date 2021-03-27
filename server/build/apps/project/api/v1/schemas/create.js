"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("@utils/data");
exports.default = {
    type: 'object',
    additionalProperties: false,
    required: [
        'name',
    ],
    properties: {
        name: {
            type: 'string',
            pattern: data_1.projectNamePatternString,
        },
        description: {
            type: ['string', 'null'],
            pattern: data_1.projectDescrPatternString,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        plugins: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
};
