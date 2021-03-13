import {emailPatternString, passwordPatternString} from '@utils/data'

export default {
    type: 'object',
    additionalProperties: false,
    required: [
        'email',
        'password',
        'repeatPassword',
    ],
    properties: {
        email: {
            type: 'string',
            pattern: emailPatternString,
        },
        password: {
            type: 'string',
            pattern: passwordPatternString,
        },
        repeatPassword: {
            type: 'string',
            pattern: passwordPatternString,
        },
    },
}
