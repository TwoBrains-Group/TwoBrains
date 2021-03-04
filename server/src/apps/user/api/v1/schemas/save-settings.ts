import {passwordPatternString} from "@utils/data";

export default {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        nickname: {
            type: 'string',
            minLength: 1,
            maxLength: 64,
        },
        password: {
            type: 'string',
            pattern: passwordPatternString,
        },
        uid: {
            type: 'string',
            minLength: 6,
            maxLength: 32,
        }
    }
}
