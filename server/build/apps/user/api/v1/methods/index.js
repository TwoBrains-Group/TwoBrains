"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_by_uid_1 = __importDefault(require("./get-by-uid"));
const save_settings_1 = __importDefault(require("./save-settings"));
const update_avatar_1 = __importDefault(require("./update-avatar"));
const change_lang_1 = __importDefault(require("./change-lang"));
const follow_1 = __importDefault(require("./follow"));
exports.default = {
    getByUid: get_by_uid_1.default,
    saveSettings: save_settings_1.default,
    updateAvatar: update_avatar_1.default,
    changeLang: change_lang_1.default,
    follow: follow_1.default,
};
