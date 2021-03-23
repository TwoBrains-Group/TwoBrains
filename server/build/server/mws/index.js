"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("./error"));
const not_supported_1 = __importDefault(require("./not-supported"));
exports.default = {
    error: error_1.default,
    notSupported: not_supported_1.default,
};
