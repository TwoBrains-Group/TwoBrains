"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const methods_1 = __importDefault(require("./methods"));
const queries_1 = __importDefault(require("./queries"));
const schemas_1 = __importDefault(require("./schemas"));
exports.default = {
    methods: methods_1.default,
    queries: queries_1.default,
    schemas: schemas_1.default,
};
