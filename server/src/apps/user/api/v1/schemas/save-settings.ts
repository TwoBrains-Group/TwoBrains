import {passwordPatternString} from "@utils/data";

export default {
    type: 'object',
    additionalProperties: false,
    required: [
        'id',
    ],
    properties: {
        nickname: {
            type: 'string',
            minLength: 1,
            maxLength: 64,
        },
        password: {
            type: 'string',
            pattern: passwordPatternString,
        }
    }
}
