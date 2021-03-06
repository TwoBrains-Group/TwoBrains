export default {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        id: {
            type: 'string',
        },
        offset: {
            type: 'number',
        },
        limit: {
            anyOf: [
                {
                    type: 'number',
                },
                {
                    type: 'null',
                },
            ],
        },
        replyTo: {
            type: 'string',
        },
    },
}
