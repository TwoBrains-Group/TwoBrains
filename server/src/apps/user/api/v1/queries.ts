export default {
    getUserByUid: `
        SELECT
            u.user_id AS "id",
            u.user_uid AS "uid",
            u.nickname AS "nickname",
            u.avatar AS "avatar",
            u.online AS "online",
            u.status AS "status"
        FROM
            main.users AS u
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
            user_id = :id::int8
        RETURNING
             user_uid AS "uid"
            ,nickname AS "nickname"
            ,avatar AS "avatar";`,
}
