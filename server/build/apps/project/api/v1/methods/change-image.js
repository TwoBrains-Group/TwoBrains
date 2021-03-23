"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const errors_1 = require("@apps/base/errors");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const app_root_path_1 = __importDefault(require("app-root-path"));
const accessibleRoles = ['admin', 'moderator'];
class ChangeImage extends Method_1.Method {
    async runFormData(req, user) {
        const { files, fields } = req.formData;
        const { id: loggedInUserId } = user;
        const { id } = fields;
        const role = await this.query('getRole', {
            id,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'role',
        });
        if (!accessibleRoles.includes(role)) {
            throw new errors_1.AuthError('Not enough rights');
        }
        const image = files.image;
        const tmpPath = image.path;
        const filename = uuid_1.v4();
        const subPath = `/${process.env.UPLOADS_DIR}/user/avatar/${filename}.jpg`.replace(/\/{2,}/g, '/');
        const newPath = `${app_root_path_1.default.toString()}/${subPath}`.replace(/\/{2,}/g, '/');
        const uri = `${process.env.HOST}:${process.env.PORT}/${subPath}`.replace(/\/{2,}/g, '/');
        await sharp_1.default(tmpPath).toFile(newPath);
        const { image: url } = await this.query('changeImage', {
            image: `http://${uri}`,
            id,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'image',
        });
        return {
            url,
        };
    }
}
exports.default = new ChangeImage({
    name: 'changeImage',
    formData: true,
});
