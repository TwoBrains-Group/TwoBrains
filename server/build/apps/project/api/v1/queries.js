"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getProjectByUid: `
        WITH tags AS (
            SELECT
                pt.project_id
                ,jsonb_agg(json_build_object(
                    'label', t.label,
                    'groupLabel', tg.label
                )) AS "tags"
            FROM
                main.projects_tags AS pt
                LEFT JOIN main.tags AS t ON t.tag_id = pt.tag_id
                LEFT JOIN main.tag_groups AS tg ON tg.tag_group_id = t.tag_group_id
            WHERE
                pt.tag_id IS NOT NULL
            GROUP BY
                pt.project_id
            LIMIT :tagsLimit
        )
        SELECT
             p.project_id AS "id"
            ,p.user_id AS "userId"
            ,p.uid AS "uid"
            ,p.name AS "name"
            ,p.image AS "image"
            ,p.description AS "description"
            ,p.creation_datetime AS "creationDatetime"
            ,(pl_liked.user_id IS NOT NULL) AS "liked"
            ,COUNT(pl.user_id) AS "likesCount"
            ,json_build_object(
                'uid', u.uid,
                'nickname', u.nickname
            ) AS "creator"
            ,json_agg(json_build_object(
                'id', pls.plugin_id,
                'uid', pls.uid
            )) AS "plugins"
            ,COALESCE(t.tags, '[]')::jsonb AS "tags"
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON u.user_id = p.user_id
            LEFT JOIN main.projects_likes AS pl_liked ON p.project_id = pl_liked.project_id AND pl_liked.user_id = :loggedInUserId
            LEFT JOIN main.projects_likes AS pl ON p.project_id = pl.project_id
            LEFT JOIN main.projects_plugins AS pp ON p.project_id = pp.project_id
            LEFT JOIN main.plugins AS pls ON pls.plugin_id = pp.plugin_id
            LEFT JOIN tags AS t ON t.project_id = p.project_id
        WHERE
            p.uid = :uid
            AND u.uid = :userUid
        GROUP BY
             p.project_id
            ,pl_liked.user_id
            ,u.uid
            ,u.nickname
            ,t.tags;`,
    getList: `
        WITH tags AS (
            SELECT
                pt.project_id
                ,jsonb_agg(jsonb_build_object(
                    'label', t.label,
                    'groupLabel', tg.label
                )) AS "tags"
            FROM
                main.projects_tags AS pt
                LEFT JOIN main.tags AS t ON t.tag_id = pt.tag_id
                LEFT JOIN main.tag_groups AS tg ON tg.tag_group_id = t.tag_group_id
            WHERE
                pt.tag_id IS NOT NULL
            GROUP BY
                pt.project_id
            LIMIT :tagsLimit
        )
        SELECT
            DISTINCT
             p.project_id AS "id"
            ,p.user_id AS "userId"
            ,p.uid AS "uid"
            ,p.name AS "name"
            ,p.image AS "image"
            ,p.description AS "description"
            ,p.creation_datetime AS "creationDatetime"
            ,(pl_liked.user_id IS NOT NULL) AS "liked"
            ,COUNT(pl.user_id) AS "likesCount"
            ,jsonb_build_object(
                'uid', u.uid,
                'nickname', u.nickname
            ) AS "creator"
            ,COALESCE(t.tags, '[]')::jsonb AS "tags"
        FROM
            main.projects AS p
            INNER JOIN main.users AS u ON u.user_id = p.user_id
            LEFT JOIN main.projects_likes AS pl_liked ON p.project_id = pl_liked.project_id AND pl_liked.user_id = :loggedInUserId
            LEFT JOIN main.projects_likes AS pl ON p.project_id = pl.project_id
            LEFT JOIN tags AS t ON t.project_id = p.project_id
        /*userUid:
        WHERE u.uid = :userUid
        */
        GROUP BY
            p.project_id,
            p.creation_datetime,
            pl.user_id,
            u.uid,
            u.nickname,
            t.tags,
            pl_liked.user_id
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
        VALUES (:id, unnest(:tags::int2[]));`,
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
    isLiked: `
        SELECT
            pl.user_id AS "liked"
        FROM
            main.projects_likes AS pl
        WHERE
            pl.project_id = :id
            AND pl.user_id = :loggedInUserId;`,
    like: `
        INSERT INTO main.projects_likes (project_id, user_id)
        VALUES (:id, :loggedInUserId);`,
    dislike: `
        DELETE FROM
            main.projects_likes AS pl
        WHERE
            pl.project_id = :id
            AND pl.user_id = :loggedInUserId;`,
    getLikesCount: `
        SELECT
            COUNT(pl.user_id) AS "count"
        FROM
            main.projects_likes AS pl
        WHERE
            pl.project_id = :id;`,
};
