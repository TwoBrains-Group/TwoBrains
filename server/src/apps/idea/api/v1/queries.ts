export default {
    getById: `
        SELECT
             idea_id AS "ideaId"
            ,name AS "name"
            ,text AS "text"
            ,creation_datetime
        FROM
            main.ideas
        WHERE
            idea_id = :id;`,

    getList: `
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,i.text AS "text"
            ,i.creation_datetime AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.user_uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(uil.user_id IS NOT NULL)::bool AS "liked"
        FROM
            main.ideas AS i
            INNER JOIN main.users AS u ON i.user_id = u.user_id
            LEFT JOIN main.users_ideas_likes AS uil ON uil.user_id = :loggedInUserId
        LIMIT :limit
        OFFSET :offset;`,

    isLiked: `
        SELECT
            (uil.user_id IS NOT NULL)::bool AS "liked"
        FROM
            main.users_ideas_likes AS uil
        WHERE
            idea_id = :ideaId::int8
            AND user_id = :userId::int8;`,

    like: `
        INSERT INTO main.users_ideas_likes (user_id, idea_id)
        VALUES (:userId::int8, :ideaId::int8);`,

    unlike: `
        DELETE FROM
            main.users_ideas_likes
        WHERE
            user_id = :userId::int8
            AND idea_id = :ideaId::int8;`,
}
