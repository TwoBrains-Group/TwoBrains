"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = __importDefault(require("express-jwt"));
const errors_1 = require("@apps/base/errors");
exports.default = express_jwt_1.default({
    algorithms: ['HS256'],
    secret: Buffer.from(process.env.JWT_SECRET, 'base64'),
    getToken: req => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1].trim();
        }
        else if (req.body.token) {
            return req.body.token;
        }
        throw new errors_1.UnauthorizedError();
    },
}).unless(unless);
