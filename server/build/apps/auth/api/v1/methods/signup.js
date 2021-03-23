"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
const nanoid_1 = require("nanoid");
const base_auth_1 = __importDefault(require("./base-auth"));
const defaultAvatar = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/user/default_avatar.png`;
class Signup extends base_auth_1.default {
    constructor(props) {
        super(props);
    }
    async run(req) {
        const { password, repeatPassword } = req.params;
        let { email } = req.params;
        email = email.toLowerCase();
        if (password !== repeatPassword) {
            throw new errors_1.InvalidParams('passwords does not match');
        }
        const userExists = await this.query('getUserByEmail', {
            email,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'userId',
        });
        if (userExists) {
            throw new errors_1.BaseError(`User with email '${email}' already exists`);
        }
        const nickname = email.split('@')[0];
        const uid = `${nickname}_${nanoid_1.nanoid(8)}`;
        const avatar = defaultAvatar;
        const userId = await this.query('createUser', {
            email,
            password,
            nickname,
            uid,
            avatar,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'userId',
        });
        const { token, userData } = await this.getToken(userId);
        return {
            token,
            result: {
                userData,
            },
        };
    }
}
exports.default = new Signup({
    name: 'signup',
    auth: false,
});
