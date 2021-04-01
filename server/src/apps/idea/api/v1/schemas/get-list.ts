export default {
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
            anyOf: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        tagsLimit: {
            type: 'number',
        },
    },
}
