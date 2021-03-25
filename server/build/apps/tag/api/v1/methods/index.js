"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_tags_1 = __importDefault(require("./get-tags"));
const get_top_1 = __importDefault(require("./get-top"));
const search_1 = __importDefault(require("./search"));
exports.default = {
    getTags: get_tags_1.default,
    getTop: get_top_1.default,
    search: search_1.default,
};
