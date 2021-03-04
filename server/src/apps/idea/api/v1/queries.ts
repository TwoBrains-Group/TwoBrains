export default {
    getById: `
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,i.text AS "text"
            ,i.creation_datetime
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
            INNER JOIN main.users AS u ON u.user_id = i.user_id
            LEFT JOIN main.ideas_likes AS uil ON uil.user_id = :loggedInUserId AND uil.idea_id = i.idea_id
        WHERE
            i.idea_id = :id;`,

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
            LEFT JOIN main.ideas_likes AS uil ON uil.user_id = :loggedInUserId AND uil.idea_id = i.idea_id
        ORDER BY i.creation_datetime DESC
        LIMIT :limit
        OFFSET :offset;`,

    isLiked: `
        SELECT
            (uil.user_id IS NOT NULL)::bool AS "liked"
        FROM
            main.ideas_likes AS uil
        WHERE
            idea_id = :ideaId::int8
            AND user_id = :userId::int8;`,

    like: `
        INSERT INTO main.ideas_likes (user_id, idea_id)
        VALUES (:userId::int8, :ideaId::int8);`,

    unlike: `
        DELETE FROM
            main.ideas_likes
        WHERE
            user_id = :userId::int8
            AND idea_id = :ideaId::int8;`,

    getComments: `
        SELECT
            ic.idea_comment_id AS "id"
            ,ic.idea_id AS "ideaId"
            ,ic.user_id AS "userId"
            ,ic.text AS "text"
            ,ic.creation_datetime::TIMESTAMP::DATE AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.user_uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(icl.user_id IS NOT NULL)::bool AS "liked"
        FROM
            main.ideas_comments AS ic
            INNER JOIN main.users AS u ON u.user_id = ic.user_id
            LEFT JOIN main.ideas_comments_likes AS icl
                ON icl.idea_comment_id = ic.idea_comment_id AND icl.user_id = :loggedInUserId
        WHERE
            ic.idea_id = :id
            AND ic.reply_to IS NULL
        ORDER BY ic.creation_datetime DESC
        LIMIT :limit
        OFFSET :offset;`,

    getCommentsReplies: `
        SELECT
            ic.idea_comment_id AS "id"
            ,ic.idea_id AS "ideaId"
            ,ic.user_id AS "userId"
            ,ic.text AS "text"
            ,ic.creation_datetime::TIMESTAMP::DATE AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.user_uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(icl.user_id IS NOT NULL)::bool AS "liked"
            ,reply_u.nickname AS "rootCommentUserNickname"
            ,reply_u.user_uid AS "rootCommentUserUid"
        FROM
            main.ideas_comments AS ic
            INNER JOIN main.users AS u ON u.user_id = ic.user_id
            INNER JOIN main.users AS reply_u ON reply_u.user_id = ic.user_id
            LEFT JOIN main.ideas_comments_likes AS icl
                ON icl.idea_comment_id = ic.idea_comment_id AND icl.user_id = :loggedInUserId
        WHERE
            ic.reply_to = :replyTo
        ORDER BY ic.creation_datetime DESC
        LIMIT :limit
        OFFSET :offset;`,

    isCommentLiked: `
        SELECT
            (icl.user_id IS NOT NULL)::bool AS "liked"
        FROM
            main.ideas_comments_likes AS icl
        WHERE
            icl.idea_comment_id = :id::int8
            AND icl.user_id = :userId::int8;`,

    likeComment: `
        INSERT INTO main.ideas_comments_likes (user_id, idea_comment_id)
        VALUES (:userId::int8, :id::int8);`,

    unlikeComment: `
        DELETE FROM
            main.ideas_comments_likes
        WHERE
            user_id = :userId::int8
            AND idea_comment_id = :id::int8;`,

    getUserIdeas: `
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,i.text AS "text"
            ,i.creation_datetime
            ,json_build_object(
                'id', u.user_id,
                'uid', u.user_uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(il.user_id IS NOT NULL)::bool AS "liked"
        FROM
            main.ideas AS i
            INNER JOIN main.users AS u ON i.user_id = u.user_id
            LEFT JOIN main.ideas_likes AS il ON i.idea_id = il.idea_id
        WHERE
            i.user_id = u.user_id
            AND u.user_uid = :uid
        ORDER BY i.creation_datetime
        LIMIT :limit
        OFFSET :offset;`,
}
