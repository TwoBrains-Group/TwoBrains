"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("@utils/dotenv");
const server_1 = __importDefault(require("./server"));
(async () => {
    await server_1.default.init();
})();
