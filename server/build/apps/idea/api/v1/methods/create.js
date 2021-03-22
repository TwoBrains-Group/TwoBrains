"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const prepareName = (name) => {
    return name.trim();
};
const prepareText = (text) => {
    return text.trim();
};
class Create extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        let { name, text, } = params;
        const { id: userId } = user;
        name = prepareName(name);
        text = prepareText(text);
        const id = await this.query('create', {
            name,
            text,
            userId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        return {
            id,
        };
    }
}
exports.default = new Create({
    name: 'create',
});
