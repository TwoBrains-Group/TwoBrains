"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const idea_1 = __importDefault(require("./idea"));
const l10n_1 = __importDefault(require("./l10n"));
const project_1 = __importDefault(require("./project"));
const tag_1 = __importDefault(require("./tag"));
const search_1 = __importDefault(require("./search"));
exports.default = {
    main: main_1.default,
    user: user_1.default,
    auth: auth_1.default,
    idea: idea_1.default,
    l10n: l10n_1.default,
    project: project_1.default,
    tag: tag_1.default,
    search: search_1.default,
};
