BEGIN TRANSACTION;
SET search_path TO main;

-- user_status --
CREATE TYPE main.user_status
AS ENUM ('active', 'deleted', 'blocked');

-- users --
DROP TABLE IF EXISTS main.users;
CREATE TABLE main.users (
    user_id BIGSERIAL NOT NULL,
    uid VARCHAR NOT NULL,
    nickname VARCHAR NOT NULL,
    avatar VARCHAR NOT NULL,
    email VARCHAR(254) NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    password VARCHAR NOT NULL,
    locale_id INT2 NOT NULL DEFAULT 38,
    status main.user_status DEFAULT 'unverified'::main.user_status NOT NULL,
    online TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT users_user_id_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_uid_ukey UNIQUE (uid),
    CONSTRAINT users_email_ukey UNIQUE (email)
);

COMMENT ON TABLE main.users IS 'Users table';
COMMENT ON COLUMN main.users.user_id IS 'User id';
COMMENT ON COLUMN main.users.uid IS 'User unique id';
COMMENT ON COLUMN main.users.nickname IS 'User nickname';
COMMENT ON COLUMN main.users.email IS 'User email';
COMMENT ON COLUMN main.users.email_verification IS 'Email verification timestamp';
COMMENT ON COLUMN main.users.password IS 'User password';
COMMENT ON COLUMN main.users.status IS 'User status';
COMMENT ON COLUMN main.users.online IS 'Last online-status update timestamp';

-- users_friends --
CREATE TABLE main.users_friends (
    user_id INT8 NOT NULL,
    friend INT8 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT users_friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT users_friends_friend_fkey FOREIGN KEY (friend) REFERENCES main.users(user_id),
    CONSTRAINT users_friends_user_id_friend_ukey UNIQUE (user_id, friend)
);

COMMENT ON TABLE main.users_friends IS 'Users friends table';
COMMENT ON COLUMN main.users_friends.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.users_friends.friend IS 'User friend id foreign key';
COMMENT ON COLUMN main.users_friends.creation_datetime IS 'Users friends binding creation datetime';


COMMIT;
