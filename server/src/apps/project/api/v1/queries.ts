export default {
    getProjectByUid: `
        SELECT
             p.project_id AS "id"
            ,p.user_id AS "userId"
            ,p.uid AS "uid"
            ,p.name AS "name"
            ,p.image AS "image"
            ,p.description AS "description"
            ,p.creation_datetime AS "creationDatetime"
            ,(pl.user_id IS NOT NULL) AS "liked"
            ,json_build_object(
                'uid', u.uid,
                'nickname', u.nickname
            ) AS "creator"
            ,json_agg(json_build_object(
                'id', pls.plugin_id,
                'name', pls.name
            )) AS "plugins"
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON u.user_id = p.user_id
            LEFT JOIN main.projects_likes AS pl ON p.project_id = pl.project_id AND pl.user_id = :loggedInUserId
            LEFT JOIN main.projects_plugins AS pp ON p.project_id = pp.project_id
            LEFT JOIN main.plugins AS pls ON pls.plugin_id = pp.plugin_id
        WHERE
            p.uid = :uid
        GROUP BY
             p.project_id
            ,pl.user_id
            ,u.uid
            ,u.nickname;`,

    getList: `
        SELECT
             p.project_id AS "id"
            ,p.user_id AS "userId"
            ,p.uid AS "uid"
            ,p.name AS "name"
            ,p.image AS "image"
            ,p.description AS "description"
            ,p.creation_datetime AS "creationDatetime"
            ,(pl.user_id IS NOT NULL) AS "liked"
            ,json_build_object(
                'uid', u.uid,
                'nickname', u.nickname
            ) AS "creator"
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON u.user_id = p.user_id
            LEFT JOIN main.projects_likes AS pl ON p.project_id = pl.project_id AND pl.user_id = :loggedInUserId
        ORDER BY p.creation_datetime DESC
        LIMIT :limit
        OFFSET :offset;`,
}
