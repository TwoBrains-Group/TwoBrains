"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_by_uid_1 = __importDefault(require("./get-by-uid"));
const get_list_1 = __importDefault(require("./get-list"));
const create_1 = __importDefault(require("./create"));
const like_1 = __importDefault(require("./like"));
exports.default = {
    getByUid: get_by_uid_1.default,
    getList: get_list_1.default,
    create: create_1.default,
    like: like_1.default,
};
