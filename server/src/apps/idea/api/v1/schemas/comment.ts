export default {
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
}
