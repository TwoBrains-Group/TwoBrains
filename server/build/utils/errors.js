"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustBeOverridden = void 0;
class MustBeOverridden extends Error {
    constructor(method, forEntity = '') {
        super(`Method ${method} must be overridden${forEntity ? ' for ' + forEntity : ''}`);
    }
}
exports.MustBeOverridden = MustBeOverridden;
