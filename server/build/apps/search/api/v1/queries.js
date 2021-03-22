"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    searchIdeas: `
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,ts_rank_cd(i.tsv, name_q) AS name_rank
            ,ts_rank_cd(i.tsv, text_q) AS text_rank
        FROM
            main.ideas AS i,
            to_tsquery('simple', :searchQuery || ':*') AS name_q,
            to_tsquery('simple', :searchQuery || ':*') AS text_q
        WHERE
            i.tsv @@ text_q
            OR i.tsv @@ name_q
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
            ,ts_rank_cd(u.tsv, nickname_q) AS nickname_rank
            ,ts_rank_cd(u.tsv, uid_q) AS uid_rank
        FROM
            main.users AS u,
            to_tsquery('simple', :searchQuery || ':*') AS nickname_q,
            to_tsquery('simple', :searchQuery || ':*') AS uid_q
        WHERE
            u.tsv @@ nickname_q
            OR u.tsv @@ uid_q
        ORDER BY
            nickname_rank DESC,
            uid_rank DESC
        LIMIT :limit;`,
};
