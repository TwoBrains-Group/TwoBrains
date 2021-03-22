"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
ajv.addKeyword({
    keyword: 'email',
    type: 'string',
    compile: (schema, parentSchema) => {
        return (value, objectKey, object, key) => {
            if (_.isString(object[key])) {
                object[key] = object[key].toLowerCase();
            }
            return true;
        };
    }
});
//# sourceMappingURL=ajv.js.map