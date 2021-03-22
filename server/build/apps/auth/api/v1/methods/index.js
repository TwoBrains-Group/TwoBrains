"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = __importDefault(require("./login"));
const signup_1 = __importDefault(require("./signup"));
exports.default = {
    login: login_1.default,
    signup: signup_1.default,
};
