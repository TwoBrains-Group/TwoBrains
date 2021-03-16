export default {
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
}
