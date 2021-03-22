"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const Pool_1 = require("@modules/db/Pool");
const errors_1 = require("@apps/base/errors");
const specialChars = '@#$%^&+=~';
const checkPassword = (pwd) => pwd.match(/^(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~]).*$/g);
class SaveSettings extends Method_1.Method {
    constructor(props) {
        super(props);
    }
    async run(req, user) {
        const { params } = req;
        const { nickname, password } = params;
        const { id } = user;
        if ('nickname' in params && (nickname.length > 64 || nickname.length === 0)) {
            throw new errors_1.InvalidParams('Nickname must be less than 64 characters long and not empty');
        }
        if ('password' in params && !checkPassword(password)) {
            throw new errors_1.InvalidParams(`password must be more than 8 characters long, contain at least one lowercase and uppercase letter, and at least one of special characters: ${specialChars.split('').join(', ')}. For your security 😄`);
        }
        await this.query('updateUser', { id, nickname, password }, {
            returnType: Pool_1.QueryReturnType.None,
            unusedToNull: ['uid', 'nickname', 'avatar', 'password'],
            queryDebugLog: true,
        });
        return {
            result: {},
        };
    }
}
exports.default = new SaveSettings({
    route: 'saveSettings',
});
//# sourceMappingURL=saveSettings.js.map