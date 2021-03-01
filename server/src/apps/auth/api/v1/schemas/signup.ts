import {emailPatternString, passwordPatternString} from "@utils/data";

export default {
    type: 'object',
    additionalProperties: false,
    required: [
        'email',
        'password',
        'passwordRepeat',
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
        passwordRepeat: {
            type: 'string',
            pattern: passwordPatternString,
        }
    }
}
