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
            main.users
        SET
             user_uid = COALESCE(:uid, user_uid)
            ,nickname = COALESCE(:nickname, nickname)
            ,avatar = COALESCE(:avatar, avatar)
            ,password = COALESCE(main.crypt(:password, main.gen_salt('bf')), password)
        WHERE
            user_id = :id;`,
}
