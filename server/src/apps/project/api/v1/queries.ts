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
                'uid', pls.uid
            )) AS "plugins"
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON u.user_id = p.user_id
            LEFT JOIN main.projects_likes AS pl ON p.project_id = pl.project_id AND pl.user_id = :loggedInUserId
            LEFT JOIN main.projects_plugins AS pp ON p.project_id = pp.project_id
            LEFT JOIN main.plugins AS pls ON pls.plugin_id = pp.plugin_id
        WHERE
            p.uid = :uid
            AND u.uid = :userUid
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

    checkAuthor: `
        SELECT
            i.idea_id AS "id"
        FROM
            main.ideas AS i
        WHERE
            i.idea_id = :id
            AND i.user_id = :loggedInUserId;`,

    edit: `
        UPDATE
            main.ideas
        SET
            name = :name,
            text = :text
        WHERE
            idea_id = :id
        RETURNING
            idea_id AS "id";`,

    create: `
        INSERT INTO main.projects (name, uid, user_id)
        VALUES (:name, :uid, :loggedInUserId)
        RETURNING project_id AS "id";`,

    bindTags: `
        INSERT INTO main.projects_tags (project_id, tag_id)
        VALUES (:id, unnest(:tags));`,

    bindPlugin: `
        INSERT INTO main.projects_plugins (project_id, plugin_id)
        SELECT
            :id,
            p.plugin_id
        FROM
            main.plugins AS p
        WHERE
            p.uid = :uid;`,

    changeImage: `
        UPDATE
            main.projects
        SET
            image = :image
        WHERE
            project_id = :id;`,

    getCreatorUid: `
        SELECT
            u.uid AS "uid"
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON p.user_id = u.user_id
        WHERE
            p.project_id = :id;`,

    checkDuplicate: `
        SELECT
            p.uid
        FROM
            main.projects AS p
        WHERE
            p.user_id = :loggedInUserId;`,
}
