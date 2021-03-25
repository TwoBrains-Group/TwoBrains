"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    searchIdeas: `
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,ts_rank_cd(i.tsv, q) AS name_rank
            ,ts_rank_cd(i.tsv, q) AS text_rank
        FROM
            main.ideas AS i,
            to_tsquery('simple', :searchQuery || ':*') AS q
        WHERE
            i.tsv @@ q
            OR i.tsv @@ q
        ORDER BY
            name_rank DESC,
            text_rank DESC
        LIMIT :limit;`,
    searchUsers: `
        SELECT
             u.user_id AS "id"
            ,u.uid AS "uid"
            ,u.nickname AS "nickname"
            ,u.avatar AS "avatar"
            ,ts_rank_cd(u.tsv, q) AS nickname_rank
            ,ts_rank_cd(u.tsv, q) AS uid_rank
        FROM
            main.users AS u,
            to_tsquery('simple', :searchQuery || ':*') AS q
        WHERE
            u.tsv @@ q
            OR u.tsv @@ q
        ORDER BY
            nickname_rank DESC,
            uid_rank DESC
        LIMIT :limit;`,
};
