export default {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        limit: {
            type: 'number',
        },
        offset: {
            type: 'number',
        },
        tagsLimit: {
            type: 'number',
        },
        userUid: {
            type: 'string',
        },
    },
}
