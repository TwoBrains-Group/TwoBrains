export default {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        locale: {
            type: 'string',
        },
        components: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['app', 'name'],
                properties: {
                    app: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                },
            },
        },
        pages: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['app', 'name'],
                properties: {
                    app: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                },
            },
        },
    },
}
