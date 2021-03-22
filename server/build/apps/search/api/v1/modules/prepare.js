"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUsers = exports.prepareIdeas = void 0;
const prepareIdeas = (ideas) => {
    for (const idea of ideas) {
        idea.url = `/idea/${idea.id}`;
    }
    return ideas;
};
exports.prepareIdeas = prepareIdeas;
const prepareUsers = (users) => {
    for (const user of users) {
        user.url = `/user/${user.uid}`;
    }
    return users;
};
exports.prepareUsers = prepareUsers;
