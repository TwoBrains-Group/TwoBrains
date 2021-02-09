"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnusedQueryParams = exports.MustBeOverridden = void 0;
class MustBeOverridden extends Error {
    constructor(method, forEntity = '') {
        super(`Method ${method} must be overridden${forEntity ? ' for ' + forEntity : ''}`);
    }
}
exports.MustBeOverridden = MustBeOverridden;
class UnusedQueryParams extends Error {
    constructor(list) {
        super(`Query preparation: Unused query params found: ${JSON.stringify(list, null, 2)}`);
    }
}
exports.UnusedQueryParams = UnusedQueryParams;
//# sourceMappingURL=errors.js.map