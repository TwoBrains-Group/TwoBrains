BEGIN TRANSACTION;
SET search_path TO main;

-- User.status --
CREATE TYPE main.user_status
AS ENUM ('active', 'deleted', 'blocked');

-- Users --
CREATE SEQUENCE main.users_user_id_seq;

DROP TABLE IF EXISTS main.users;
CREATE TABLE main.users (
    user_id INT8 DEFAULT nextval('main.users_user_id_seq'::regclass) NOT NULL,
    user_uid VARCHAR NOT NULL,
    nickname VARCHAR NOT NULL,
    avatar VARCHAR NOT NULL,
    email VARCHAR(254) NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    password VARCHAR NOT NULL,
    status main.user_status DEFAULT 'unverified'::main.user_status NOT NULL,
    online TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    CONSTRAINT users_user_id_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_user_uid_ukey UNIQUE (user_uid),
    CONSTRAINT users_email_ukey UNIQUE (email)
);

COMMENT ON TABLE main.users IS 'Users table';
COMMENT ON COLUMN main.users.user_id IS 'User id';
COMMENT ON COLUMN main.users.user_uid IS 'User unique id';
COMMENT ON COLUMN main.users.nickname IS 'User nickname';
COMMENT ON COLUMN main.users.email IS 'User email';
COMMENT ON COLUMN main.users.email_verification IS 'Email verification timestamp';
COMMENT ON COLUMN main.users.password IS 'User password';
COMMENT ON COLUMN main.users.status IS 'Gambler status';
COMMENT ON COLUMN main.users.online IS 'Last online-status update timestamp';

COMMIT;
