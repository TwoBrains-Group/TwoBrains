"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@apps/base");
class User extends base_1.BaseApp {
    constructor(props) {
        super(props);
    }
}
exports.default = new User({
    name: 'user',
});
