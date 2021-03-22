"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = __importDefault(require("./load"));
const get_locales_1 = __importDefault(require("./get-locales"));
exports.default = {
    load: load_1.default,
    getLocales: get_locales_1.default,
};
