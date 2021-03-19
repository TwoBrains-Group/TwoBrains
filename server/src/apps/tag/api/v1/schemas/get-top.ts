export default {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        type: {
            type: 'string',
            enum: ['idea', 'project'],
        },
        group: {
            type: 'string',
        },
        count: {
            type: 'number',
            default: 10,
        },
    },
}
