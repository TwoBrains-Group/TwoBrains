"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'getUserByEmail': `
        SELECT
            u.user_id AS "userId"
        FROM
            main.users AS u
        WHERE
            email = :email;`,
    'verifyPassword': `
        SELECT
            (u.password = main.crypt(:password, u.password))::bool AS "passwordVerified"
        FROM
            main.users AS u
        WHERE
            u.user_id = :userId;`,
};
//# sourceMappingURL=queries.js.map