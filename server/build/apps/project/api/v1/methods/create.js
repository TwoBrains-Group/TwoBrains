"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const nanoid_1 = require("nanoid");
const DEFAULT_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_image.png`;
const DEFAULT_COVER_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_cover_image.png`;
const defaultPlugins = [];
class Create extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id: loggedInUserId } = user;
        const { tags } = params;
        let { name, description = null, } = params;
        name = name.trim();
        description = description && description.trim();
        let { plugins } = params;
        plugins = [...defaultPlugins, ...plugins];
        const uid = `${name.replace(/\s+/, '_')}_${nanoid_1.nanoid(8)}`.toLowerCase();
        const image = DEFAULT_IMAGE;
        const coverImage = DEFAULT_COVER_IMAGE;
        const id = await this.query('create', {
            name,
            description,
            uid,
            image,
            coverImage,
            loggedInUserId,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'id',
        });
        if (tags.length) {
            await this.query('bindTags', {
                id,
                tags,
            });
        }
        if (plugins.length) {
            await this.query('bindPlugin', {
                id,
                plugins,
            });
        }
        const creatorUid = await this.query('getCreatorUid', {
            id,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'uid',
        });
        const url = `/user/${creatorUid}/project/${uid}`;
        return {
            url,
        };
    }
}
exports.default = new Create({
    name: 'create',
});
