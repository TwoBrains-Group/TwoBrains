"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareIdeas = exports.prepareIdea = void 0;
const pretty_time_1 = __importDefault(require("@modules/pretty-time"));
const prepareIdea = (idea) => {
    idea.prettyCreationDatetime = pretty_time_1.default.prettyDiff(idea.creationDatetime);
    idea.creationDatetime = pretty_time_1.default.prettyDate(idea.creationDatetime);
    return idea;
};
exports.prepareIdea = prepareIdea;
const prepareIdeas = (ideas) => ideas.map(exports.prepareIdea);
exports.prepareIdeas = prepareIdeas;
