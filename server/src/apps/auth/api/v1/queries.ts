export default {
    getUserByEmail: `
        SELECT
            u.user_id AS "userId"
        FROM
            main.users AS u
        WHERE
            email = :email;`,

    verifyPassword: `
        SELECT
            (u.password = main.crypt(:password, u.password))::bool AS "passwordVerified"
        FROM
            main.users AS u
        WHERE
            u.user_id = :userId;`,

    getUserData: `
        SELECT
            u.user_id AS "id"
            ,u.user_uid AS "uid"
            ,u.avatar AS "avatar"
            ,u.nickname AS "nickname"
            ,u.email AS "email"
            ,(u.email_verified IS NOT NULL)::bool AS "emailVerified"
            ,(u.status = 'blocked'::main.user_status)::bool AS "blocked"
            ,(u.status = 'deleted'::main.user_status)::bool AS "deleted"
            ,(u.status = 'active'::main.user_status)::bool AS "active"
        FROM
            main.users AS u
        WHERE
            u.user_id = :userId;`,

    createUser: `
        INSERT INTO
            main.users (user_uid, nickname, email, password, avatar)
        VALUES
            (:uid, :nickname, :email, main.crypt(:password, main.gen_salt('bf')), :avatar)
        RETURNING
            user_id AS "userId";`,
}
