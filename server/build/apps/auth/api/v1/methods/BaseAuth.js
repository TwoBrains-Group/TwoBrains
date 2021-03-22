"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Pool_1 = require("@modules/db/Pool");
const errors_1 = require("@apps/base/errors");
class BaseAuth extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async getToken() {
        const userData = await this.query('getUserData', { userId }, {
            returnType: Pool_1.QueryReturnType.Row,
        });
        if (userData.blocked) {
            throw new errors_1.MethodError('This user is blocked');
        }
        if (userData.deleted) {
            throw new errors_1.MethodError('This user is deleted');
        }
        return jsonwebtoken_1.default.sign({ userData }, process.env.JWT_SECRET, { algorithm: 'HS256' });
    }
}
exports.default = new BaseAuth({
    route: null,
});
//# sourceMappingURL=BaseAuth.js.map