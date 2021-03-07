export default {
    getUserByUid: `
        SELECT
             u.user_id AS "id"
            ,u.user_uid AS "uid"
            ,u.nickname AS "nickname"
            ,u.avatar AS "avatar"
            ,u.online AS "online"
            ,u.status AS "status"
            ,l.code
        FROM
            main.users AS u
            INNER JOIN main.locales AS l ON l.locale_id = u.locale_id
        WHERE
            u.user_uid = :uid;`,

    updateUser: `
        UPDATE
            main.users AS u
        SET
             user_uid = COALESCE(:uid, u.user_uid)
            ,nickname = COALESCE(:nickname, u.nickname)
            ,avatar = COALESCE(:avatar, u.avatar)
            ,password = COALESCE(main.crypt(:password, main.gen_salt('bf')), u.password)
        WHERE
            u.user_id = :id::int8
        RETURNING
             u.user_uid AS "uid"
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
}
