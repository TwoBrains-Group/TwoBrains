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
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        // plugins: {
        //     type: 'array',
        //     items: {
        //         type: 'string',
        //     },
        // },
    },
}
