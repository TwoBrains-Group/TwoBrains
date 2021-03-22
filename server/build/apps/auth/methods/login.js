"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const errors_1 = require("@apps/base/errors");
const Pool_1 = require("@modules/db/Pool");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Login extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req) {
        this.log.warn(`Got request: ${JSON.stringify(req, null, 2)}`);
        let { email, password } = req.params;
        email = email.toLowerCase();
        if (email.length > 320) {
            throw new errors_1.InvalidParams('email must be less than 320 characters long');
        }
        if (password.length > 128) {
            throw new errors_1.InvalidParams('password must be less than 128 characters long');
        }
        if (password.length < 8) {
            throw new errors_1.InvalidParams('password must be more than 8 characters long');
        }
        const userId = await this.query('getUserByEmail', { email }, {
            returnType: Pool_1.QueryReturnType.ROW,
            returnField: 'userId',
        });
        if (!userId) {
            throw new errors_1.MethodError(`User with email ${email} not found`);
        }
        const passwordVerified = await this.query('verifyPassword', { password, userId }, {
            returnType: Pool_1.QueryReturnType.ROW,
            returnField: 'passwordVerified',
        });
        if (!passwordVerified) {
            throw new errors_1.MethodError(`Invalid password`);
        }
        const userData = await this.query('getUserData', { userId }, {
            returnType: Pool_1.QueryReturnType.ROW,
        });
        if (userData.blocked) {
            throw new errors_1.MethodError('This user is blocked');
        }
        if (userData.deleted) {
            throw new errors_1.MethodError('This user is deleted');
        }
        const token = jsonwebtoken_1.default.sign({ userData }, process.env.JWT_SECRET, { algorithm: 'HS256' });
        return {
            result: {
                user: userData,
            },
            token,
        };
    }
}
exports.default = new Login({
    route: 'login',
});
//# sourceMappingURL=login.js.map