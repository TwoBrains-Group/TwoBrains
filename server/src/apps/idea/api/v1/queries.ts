import {Queries} from '@modules/db/pool'

export default {
    // Main getters //
    getById: `
        WITH tags AS (
            SELECT
                it.idea_id
                ,jsonb_agg(json_build_object(
                    'label', t.label,
                    'groupLabel', tg.label
                )) AS "tags"
            FROM
                main.ideas_tags AS it
                LEFT JOIN main.tags AS t ON t.tag_id = it.tag_id
                LEFT JOIN main.tag_groups AS tg ON tg.tag_group_id = t.tag_group_id
            WHERE
                it.tag_id IS NOT NULL
            GROUP BY
                it.idea_id
            LIMIT :tagsLimit
        )
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,i.text AS "text"
            ,i.creation_datetime AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,likes_count.lcount AS "likesCount"
            ,likes_count.dcount AS "dislikesCount"
            ,il_liked.user_id IS NOT NULL AS "likeExists"
            ,il_liked.dislike = FALSE AS "liked"
            ,il_liked.dislike = TRUE AS "disliked"
            ,COALESCE(t.tags, '[]')::jsonb AS "tags"
        FROM
            main.ideas AS i
            INNER JOIN main.users AS u ON u.user_id = i.user_id
            LEFT JOIN LATERAL (
                SELECT
                     COUNT(nullif(il.dislike, true))  AS lcount
                    ,COUNT(nullif(il.dislike, false)) AS dcount
                FROM
                    main.ideas_likes AS il
                WHERE
                    il.idea_id = i.idea_id
            ) AS likes_count ON TRUE
            LEFT JOIN main.ideas_likes AS il_liked ON il_liked.idea_id = i.idea_id AND il_liked.user_id = :loggedInUserId
            LEFT JOIN tags AS t ON t.idea_id = i.idea_id
        WHERE
            i.idea_id = :ideaId
        GROUP BY
            i.idea_id,
            u.user_id,
            il_liked.user_id,
            il_liked.dislike,
            likes_count.lcount,
            likes_count.dcount,
            t.tags;`,

    getList: `
        WITH tags AS (
            SELECT
                it.idea_id
                ,jsonb_agg(json_build_object(
                    'label', t.label,
                    'groupLabel', tg.label
                )) AS "tags"
            FROM
                main.ideas_tags AS it
                LEFT JOIN main.tags AS t ON t.tag_id = it.tag_id
                LEFT JOIN main.tag_groups AS tg ON tg.tag_group_id = t.tag_group_id
            WHERE
                it.tag_id IS NOT NULL
            GROUP BY
                it.idea_id
            LIMIT :tagsLimit
        )
        SELECT
             i.idea_id AS "id"
            ,i.name AS "name"
            ,i.text AS "text"
            ,i.creation_datetime AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,likes_count.lcount AS "likesCount"
            ,likes_count.dcount AS "dislikesCount"
            ,il_liked.user_id IS NOT NULL AS "likeExists"
            ,il_liked.dislike = FALSE AS "liked"
            ,il_liked.dislike = TRUE AS "disliked"
            ,COALESCE(t.tags, '[]')::jsonb AS "tags"
        FROM
            main.ideas AS i
            INNER JOIN main.users AS u ON i.user_id = u.user_id
            INNER JOIN LATERAL (
                SELECT
                     COUNT(nullif(il.dislike, true))  AS lcount
                    ,COUNT(nullif(il.dislike, false)) AS dcount
                FROM
                    main.ideas_likes AS il
                WHERE
                    il.idea_id = i.idea_id
            ) AS likes_count ON TRUE
            LEFT JOIN main.ideas_likes AS il_liked ON il_liked.idea_id = i.idea_id AND il_liked.user_id = :loggedInUserId
            LEFT JOIN tags AS t ON t.idea_id = i.idea_id
            WHERE
                TRUE
        /* relation:
                AND i.relation = :relation::main.idea_relation
        */
        /* userUid:
                AND u.uid = :userUid
        */
        /* ideaId:
                AND i.idea_id = :ideaId
        */
        GROUP BY
            i.idea_id,
            u.user_id,
            il_liked.user_id,
            il_liked.dislike,
            likes_count.lcount,
            likes_count.dcount,
            i.creation_datetime,
            t.tags
        ORDER BY i.creation_datetime DESC
        LIMIT :limit
        OFFSET :offset;`,

    // Likes //
    like: `
        INSERT INTO main.ideas_likes (user_id, idea_id, dislike)
        VALUES (:userId::int8, :ideaId::int8, :dislike);`,

    getLikeStatus: `
        SELECT
             (il.user_id IS NOT NULL)::BOOL AS "exists"
            ,(il.dislike = TRUE)::BOOL AS "dislike"
        FROM
            main.ideas_likes AS il
        WHERE
            il.idea_id = :ideaId::int8
            AND il.user_id = :userId::int8;`,

    getLikesCount: `
        SELECT
             COUNT(il.user_id) FILTER (WHERE il.dislike = FALSE) AS "likesCount"
            ,COUNT(il.user_id) FILTER (WHERE il.dislike = TRUE) AS "dislikesCount"
        FROM
            main.ideas_likes AS il
        WHERE
            il.idea_id = :ideaId;`,

    unlike: `
        DELETE FROM
            main.ideas_likes
        WHERE
            user_id = :userId::int8
            AND idea_id = :ideaId::int8;`,

    // Comments //
    getComments: `
        SELECT
            ic.idea_comment_id AS "id"
            ,ic.idea_id AS "ideaId"
            ,ic.user_id AS "userId"
            ,ic.text AS "text"
            ,ic.creation_datetime::TIMESTAMP::DATE AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(icl_liked.user_id IS NOT NULL)::bool AS "liked"
            ,COUNT(icl.user_id) AS "likesCount"
        FROM
            main.ideas_comments AS ic
            INNER JOIN main.users AS u ON u.user_id = ic.user_id
            LEFT JOIN main.ideas_comments_likes AS icl_liked
                ON icl_liked.idea_comment_id = ic.idea_comment_id AND icl_liked.user_id = :loggedInUserId
            LEFT JOIN main.ideas_comments_likes AS icl ON icl.idea_comment_id = ic.idea_comment_id
        WHERE
            ic.idea_id = :id
            AND ic.reply_to IS NULL
            AND ic.deleted IS NULL
        GROUP BY
            ic.idea_comment_id,
            u.user_id,
            icl_liked.user_id,
            ic.creation_datetime
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
                'uid', u.uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(icl_liked.user_id IS NOT NULL)::bool AS "liked"
            ,COUNT(icl.user_id) AS "likesCount"
            ,reply_u.nickname AS "rootCommentUserNickname"
            ,reply_u.uid AS "rootCommentUserUid"
        FROM
            main.ideas_comments AS ic
            INNER JOIN main.users AS u ON u.user_id = ic.user_id
            INNER JOIN main.users AS reply_u ON reply_u.user_id = ic.user_id
            LEFT JOIN main.ideas_comments_likes AS icl_liked
                ON icl_liked.idea_comment_id = ic.idea_comment_id AND icl_liked.user_id = :loggedInUserId
            LEFT JOIN main.ideas_comments_likes AS icl ON icl.idea_comment_id = ic.idea_comment_id
        WHERE
            ic.reply_to = :replyTo
            AND ic.deleted IS NULL
        GROUP BY
            ic.idea_comment_id,
            u.user_id,
            icl_liked.user_id,
            reply_u.nickname,
            reply_u.uid,
            ic.creation_datetime
        ORDER BY ic.creation_datetime DESC
        LIMIT :limit
        OFFSET :offset;`,

    comment: `
        INSERT INTO main.ideas_comments (idea_id, user_id, text)
        VALUES (:ideaId, :userId, :text)
        RETURNING idea_comment_id AS "id";`,

    getCommentById: `
        SELECT
            ic.idea_comment_id AS "id"
            ,ic.idea_id AS "ideaId"
            ,ic.user_id AS "userId"
            ,ic.text AS "text"
            ,ic.creation_datetime::TIMESTAMP::DATE AS "creationDatetime"
            ,json_build_object(
                'id', u.user_id,
                'uid', u.uid,
                'nickname', u.nickname,
                'avatar', u.avatar,
                'online', u.online
            ) AS "user"
            ,(icl_liked.user_id IS NOT NULL)::bool AS "liked"
            ,COUNT(icl.user_id) AS "likesCount"
        FROM
            main.ideas_comments AS ic
            INNER JOIN main.users AS u ON u.user_id = ic.user_id
            LEFT JOIN main.ideas_comments_likes AS icl_liked
                ON icl_liked.idea_comment_id = ic.idea_comment_id AND icl_liked.user_id = :loggedInUserId
            LEFT JOIN main.ideas_comments_likes AS icl ON icl.idea_comment_id = ic.idea_comment_id
        WHERE
            ic.idea_comment_id = :id
            AND ic.deleted IS NULL
        GROUP BY
            ic.idea_comment_id,
            u.user_id,
            icl_liked.user_id,
            ic.creation_datetime;`,

    checkCommentCreator: `
        SELECT
            ic.user_id AS "userId"
        FROM
            main.ideas_comments AS ic
        WHERE
            ic.idea_comment_id = :id
            AND ic.user_id = :userId;`,

    deleteComment: `
        UPDATE main.ideas_comments AS ic
        SET deleted = NOW()
        WHERE
            ic.idea_comment_id = :id
            AND ic.user_id = :userId`,

    replyToComment: `
        INSERT INTO main.ideas_comments (idea_id, user_id, text, reply_to)
        VALUES (:ideaId, :loggedInUserId, :text, :replyTo);`,

    // Comments-likes //
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

    getCommentLikesCount: `
        SELECT
            COUNT(icl.user_id) AS "count"
        FROM
            main.ideas_comments_likes AS icl
        WHERE
            icl.user_id = :userId
            AND icl.idea_comment_id = :id;`,

    create: `
        INSERT INTO main.ideas AS i (user_id, name, text)
        VALUES (:userId, :name, :text)
        RETURNING i.idea_id AS "id";`,

} as Queries
