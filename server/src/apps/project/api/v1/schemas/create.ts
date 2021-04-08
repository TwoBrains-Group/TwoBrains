import {projectNamePatternString, projectDescrPatternString} from '@utils/data'

export default {
    type: 'object',
    additionalProperties: false,
    required: [
        'name',
        'description',
        'tags',
        'plugins',
        'visibility',
    ],
    properties: {
        name: {
            type: 'string',
            pattern: projectNamePatternString,
        },
        description: {
            type: ['string', 'null'],
            pattern: projectDescrPatternString,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        plugins: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        visibility: {
            type: 'string',
            enum: ['private', 'public'],
        },
    },
}
