export default {
    getUserByUid: `
        SELECT
             u.user_id AS "id"
            ,u.uid AS "uid"
            ,u.nickname AS "nickname"
            ,u.avatar AS "avatar"
            ,u.online AS "online"
            ,l.code
            ,(uf.user_id IS NOT NULL)::BOOL AS "following"
            ,(uf_contra.user_id IS NOT NULL)::BOOL AS "followingYou"
            ,(uf.user_id IS NOT NULL AND uf_contra.user_id IS NOT NULL)::BOOL AS "mutualFollowing"
        FROM
            main.users AS u
            INNER JOIN main.locales AS l ON l.locale_id = u.locale_id
            LEFT JOIN main.users_followers AS uf ON uf.follower = :loggedInUserId AND uf.user_id = u.user_id
            LEFT JOIN main.users_followers AS uf_contra ON uf_contra.user_id = :loggedInUserId AND uf_contra.follower = u.user_id
        WHERE
            u.uid = :uid;`,

    updateUser: `
        UPDATE
            main.users AS u
        SET
             uid = COALESCE(:uid, u.uid)
            ,nickname = COALESCE(:nickname, u.nickname)
            ,avatar = COALESCE(:avatar, u.avatar)
            ,password = COALESCE(main.crypt(:password, main.gen_salt('bf')), u.password)
        WHERE
            u.user_id = :id::int8
        RETURNING
             u.uid AS "uid"
            ,u.nickname AS "nickname"
            ,u.avatar AS "avatar";`,

    changeLang: `
        UPDATE
            main.users
        SET
            locale_id = l.locale_id
        FROM
            main.locales AS l
        WHERE
            l.code = :locale
            AND user_id = :id
        RETURNING
            l.code AS "locale"`,

    getFollowingStatus: `
        SELECT
             (uf.user_id IS NOT NULL)::BOOL AS "following"
            ,(uf_contra.user_id IS NOT NULL)::BOOL AS "followingYou"
            ,(uf.user_id IS NOT NULL AND uf_contra.user_id IS NOT NULL)::BOOL AS "mutualFollowing"
        FROM
            main.users AS u
            LEFT JOIN main.users_followers AS uf ON uf.follower = :loggedInUserId AND uf.user_id = u.user_id
            LEFT JOIN main.users_followers AS uf_contra ON uf_contra.user_id = :loggedInUserId AND uf_contra.follower = u.user_id
        WHERE
            u.user_id = :id;`,

    follow: `
        INSERT INTO main.users_followers (follower, user_id)
        VALUES (:loggedInUserId, :id);`,

    unfollow: `
        DELETE FROM
            main.users_followers AS uf
        WHERE
            uf.follower = :loggedInUserId
            AND uf.user_id = :id;`,

    isFollowing: `
        SELECT
            (uf.user_id IS NOT NULL)::BOOL AS "following"
        FROM
             main.users_followers AS uf
        WHERE
            uf.follower = :loggedInUserId
            AND uf.user_id = :id;`,
}
