"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const DEFAULT_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_image.png`;
const DEFAULT_COVER_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_cover_image.png`;
const defaultPlugins = [];
class Create extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id: loggedInUserId } = user;
        const { name, tags, plugins, } = params;
        const uid = name.replace(/\s+/, '_').toLowerCase();
        const image = DEFAULT_IMAGE;
        const coverImage = DEFAULT_COVER_IMAGE;
        const id = await this.query('create', {
            name,
            uid,
            image,
            coverImage,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        await this.query('bindTags', {
            id,
            tags,
        });
        await this.query('bindPlugin', {
            id,
            plugins: [...defaultPlugins, ...plugins],
        });
        return {
            id,
        };
    }
}
exports.default = new Create({
    name: 'create',
});
