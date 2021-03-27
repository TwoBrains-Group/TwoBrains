export default {
    type: 'object',
    additionalProperties: false,
    required: [
        'userUid',
        'uid',
    ],
    properties: {
        userUid: {
            type: 'string',
        },
        uid: {
            type: 'string',
        },
    },
}
