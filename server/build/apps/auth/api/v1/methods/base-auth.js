"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
class BaseAuth extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async getToken(userId) {
        const userData = await this.query('getUserData', {
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
        });
        if (userData.deleted) {
            throw new errors_1.BaseError('This user is deleted');
        }
        const token = jsonwebtoken_1.default.sign({
            userData,
        }, Buffer.from(process.env.JWT_SECRET, 'base64'), {
            algorithm: 'HS256',
        });
        return {
            token,
            userData,
        };
    }
}
exports.default = BaseAuth;
