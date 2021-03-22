"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'getUserByUid': `
        SELECT
            u.user_id AS "userId",
            u.user_uid AS "userUid",
            u.nickname AS "nickname",
            u.avatar AS "avatar",
            u.online AS "online",
            u.status AS "status"
        FROM
            main.users AS u
        WHERE
            u.user_uid = :uid;`,
};
//# sourceMappingURL=queries.js.map