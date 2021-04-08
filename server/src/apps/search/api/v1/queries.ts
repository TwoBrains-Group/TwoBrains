export default {
    searchIdeas: `
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,ts_rank_cd(i.tsv, q) AS rank
        FROM
            main.ideas AS i,
            to_tsquery('simple', :searchQuery || ':*') AS q
        WHERE
            i.tsv @@ q
        ORDER BY
            rank DESC
        LIMIT :limit;`,

    searchUsers: `
        SELECT
             u.user_id AS "id"
            ,u.uid AS "uid"
            ,u.nickname AS "nickname"
            ,u.avatar AS "avatar"
            ,ts_rank_cd(u.tsv, q) AS rank
        FROM
            main.users AS u,
            to_tsquery('simple', :searchQuery || ':*') AS q
        WHERE
            u.tsv @@ q
        ORDER BY
            rank DESC
        LIMIT :limit;`,

    searchProjects: `
        SELECT
             p.name AS "name"
            ,p.image AS "image"
            ,p.uid AS "uid"
            ,u.uid AS "userUid"
            ,ts_rank_cd(p.tsv, q) AS rank
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON u.user_id = p.user_id,
            to_tsquery('simple', :searchQuery || ':*') AS q
        WHERE
            p.tsv @@ q
        ORDER BY
            rank DESC
        LIMIT :limit;`,
}
