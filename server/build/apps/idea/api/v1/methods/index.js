"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_by_id_1 = __importDefault(require("./get-by-id"));
const get_list_1 = __importDefault(require("./get-list"));
const like_1 = __importDefault(require("./like"));
const get_comments_1 = __importDefault(require("./get-comments"));
const like_comment_1 = __importDefault(require("./like-comment"));
const create_1 = __importDefault(require("./create"));
const comment_1 = __importDefault(require("./comment"));
const delete_comment_1 = __importDefault(require("./delete-comment"));
const reply_to_comment_1 = __importDefault(require("./reply-to-comment"));
const edit_1 = __importDefault(require("./edit"));
exports.default = {
    getById: get_by_id_1.default,
    getList: get_list_1.default,
    like: like_1.default,
    getComments: get_comments_1.default,
    likeComment: like_comment_1.default,
    create: create_1.default,
    comment: comment_1.default,
    deleteComment: delete_comment_1.default,
    replyToComment: reply_to_comment_1.default,
    edit: edit_1.default,
};
