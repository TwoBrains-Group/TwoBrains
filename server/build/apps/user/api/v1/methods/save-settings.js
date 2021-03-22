"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class SaveSettings extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req, user) {
        const { params } = req;
        const { id } = user;
        const { nickname, password } = params;
        let { uid } = params;
        if (uid) {
            uid = uid.replace(/ /, '');
        }
        const updatedData = await this.query('updateUser', {
            id,
            nickname,
            password,
            uid,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            unusedToNull: ['uid', 'nickname', 'avatar', 'password', 'locale'],
            queryDebugLog: true,
        });
        return {
            updatedData,
        };
    }
}
exports.default = new SaveSettings({
    name: 'saveSettings',
});
