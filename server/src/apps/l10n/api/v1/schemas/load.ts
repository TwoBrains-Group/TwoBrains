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
                properties: {
                    app: {
                        type: 'string'
                    },
                    page: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                },
            },
        },
        pages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    app: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                }
            },
        }
    },
}
