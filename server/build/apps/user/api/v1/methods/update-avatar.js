"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const app_root_path_1 = __importDefault(require("app-root-path"));
const file_type_1 = __importDefault(require("file-type"));
const pool_1 = require("@modules/db/pool");
class UpdateAvatar extends Method_1.Method {
    async runFormData(req, user) {
        const { files } = req.formData;
        const { id: loggedInUserId } = user;
        const avatar = files.avatar;
        const tmpPath = avatar.path;
        const fileInfo = await file_type_1.default.fromFile(tmpPath);
        const extname = fileInfo.ext;
        this.log.debug(`TMP Path: ${tmpPath}`);
        const data = fs_1.default.readFileSync(tmpPath);
        const filename = uuid_1.v4();
        const subPath = `/${process.env.UPLOADS_DIR}/user/avatar/${filename}.${extname}`.replace(/\/{2,}/g, '/');
        const newPath = `${app_root_path_1.default.toString()}/${subPath}`.replace(/\/{2,}/g, '/');
        const uri = `${process.env.HOST}:${process.env.PORT}/${subPath}`.replace(/\/{2,}/g, '/');
        this.log.debug(`New path: ${newPath}, uri: ${uri}`);
        fs_1.default.writeFileSync(newPath, data);
        const { avatar: url } = await this.query('updateUser', {
            avatar: `http://${uri}`,
            id: loggedInUserId,
        }, {
            unusedToNull: ['uid', 'nickname', 'password'],
            returnType: pool_1.QueryReturnType.Row,
            queryDebugLog: true,
        });
        return {
            url,
        };
    }
}
exports.default = new UpdateAvatar({
    name: 'updateAvatar',
    formData: true,
});
