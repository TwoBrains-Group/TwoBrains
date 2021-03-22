"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@apps/base/errors");
const pool_1 = require("@modules/db/pool");
const base_auth_1 = __importDefault(require("./base-auth"));
class Login extends base_auth_1.default {
    async run(req) {
        this.log.warn(`Got request: ${JSON.stringify(req, null, 2)}`);
        let { email } = req.params;
        const { password } = req.params;
        email = email.toLowerCase();
        const userId = await this.query('getUserByEmail', {
            email,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'userId',
        });
        if (!userId) {
            throw new errors_1.AuthError(`User with email '${email}' not found`);
        }
        const passwordVerified = await this.query('verifyPassword', {
            password,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'passwordVerified',
        });
        if (!passwordVerified) {
            throw new errors_1.AuthError('Invalid password');
        }
        const { token, userData } = await this.getToken(userId);
        return {
            result: {
                userData,
            },
            token,
        };
    }
}
exports.default = new Login({
    name: 'login',
});
