"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
const pretty_time_1 = __importDefault(require("@modules/pretty-time"));
const DEFAULT_LIMIT = 25;
class GetComments extends Method_1.Method {
    async run(req, user) {
        const { params } = req;
        const { id, limit = DEFAULT_LIMIT, offset = 0, replyTo = null, } = params;
        const { id: loggedInUserId } = user;
        let comments;
        if (replyTo) {
            const queryParams = {
                ideaId: id,
                limit,
                offset,
                loggedInUserId,
                replyTo,
            };
            comments = await this.query('getCommentsReplies', queryParams, {
                returnType: pool_1.QueryReturnType.Rows,
            });
        }
        else {
            const queryParams = {
                id,
                limit,
                offset,
                loggedInUserId,
            };
            comments = await this.query('getComments', queryParams, {
                returnType: pool_1.QueryReturnType.Rows,
            });
        }
        if (comments) {
            for (const cmt of comments) {
                cmt.creationDatetime = pretty_time_1.default.prettyDiff(cmt.creationDatetime);
            }
        }
        console.log(`Comments: ${JSON.stringify(comments, null, 2)}`);
        return {
            comments,
        };
    }
}
exports.default = new GetComments({
    name: 'getComments',
});
