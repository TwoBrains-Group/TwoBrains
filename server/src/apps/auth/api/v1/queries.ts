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
            ,u.uid AS "uid"
            ,u.avatar AS "avatar"
            ,u.nickname AS "nickname"
            ,u.email AS "email"
            ,l.code AS "locale"
        FROM
            main.users AS u
            INNER JOIN main.locales AS l ON l.locale_id = u.locale_id
        WHERE
            u.user_id = :userId;`,

    createUser: `
        INSERT INTO
            main.users (uid, nickname, email, password, avatar)
        VALUES
            (:uid, :nickname, :email, main.crypt(:password, main.gen_salt('bf')), :avatar)
        RETURNING
            user_id AS "userId";`,
}
