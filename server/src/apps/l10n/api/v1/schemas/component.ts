export default {
    type: 'object',
    additionalProperties: false,
    required: [
        'name',
    ],
    properties: {
        name: {
            type: 'string',
        },
        appName: {
            type: 'string',
        },
    },
}
