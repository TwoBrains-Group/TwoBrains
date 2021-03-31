"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRes = exports.template = void 0;
exports.template = {
    app: 'unknown',
    method: 'unknown',
    v: 0,
};
const getRes = (res) => {
    if (!res) {
        throw new Error('Result is null or undefined');
    }
    if ('result' in res) {
        return {
            ...exports.template,
            ...res,
        };
    }
    return {
        ...exports.template,
        result: res,
    };
};
exports.getRes = getRes;
