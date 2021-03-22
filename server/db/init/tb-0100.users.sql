BEGIN TRANSACTION;
SET search_path TO main;

-- users --
DROP TABLE IF EXISTS main.users;
CREATE TABLE main.users (
    user_id SERIAL4 NOT NULL,
    uid VARCHAR NOT NULL,
    nickname VARCHAR NOT NULL,
    avatar VARCHAR NOT NULL,
    email VARCHAR(254) NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    password VARCHAR NOT NULL,
    locale_id INT2 NOT NULL DEFAULT main.get_default_locale(),
    online TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    tsv tsvector NOT NULL,
    CONSTRAINT users_user_id_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id),
    CONSTRAINT users_uid_ukey UNIQUE (uid),
    CONSTRAINT users_email_ukey UNIQUE (email)
);

COMMENT ON TABLE main.users IS 'Users table';
COMMENT ON COLUMN main.users.user_id IS 'User id';
COMMENT ON COLUMN main.users.uid IS 'User unique id';
COMMENT ON COLUMN main.users.nickname IS 'User nickname';
COMMENT ON COLUMN main.users.avatar IS 'User avatar';
COMMENT ON COLUMN main.users.email IS 'User email';
COMMENT ON COLUMN main.users.email_verified IS 'Email verification timestamp';
COMMENT ON COLUMN main.users.password IS 'User password';
COMMENT ON COLUMN main.users.locale_id IS 'User locale - chosen language';
COMMENT ON COLUMN main.users.online IS 'User online status timestamp';
COMMENT ON COLUMN main.users.deleted IS 'User deletion timestamp';
COMMENT ON COLUMN main.users.tsv IS 'User tsvector for search';

-- users_tsv_idx --
CREATE INDEX users_tsv_idx ON main.users USING gin(tsv);

-- users_tsv_update --
CREATE FUNCTION users_tsv_update() RETURNS trigger AS $$
BEGIN
    new.tsv =
        setweight(to_tsvector(new.nickname), 'A') ||
        setweight(to_tsvector(new.uid), 'D');
    return new;
END
$$ LANGUAGE plpgsql;

-- users_tsv_update_trigger --
CREATE TRIGGER users_tsv_update_trigger BEFORE INSERT OR UPDATE
ON main.users FOR EACH ROW EXECUTE PROCEDURE users_tsv_update();

-- users_followers --
CREATE TABLE main.users_followers (
    follower INT4 NOT NULL,
    user_id INT4 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT users_followers_follower_fkey FOREIGN KEY (follower) REFERENCES main.users(user_id),
    CONSTRAINT users_followers_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT users_friends_user_id_friend_ukey UNIQUE (user_id, follower)
);

COMMENT ON TABLE main.users_followers IS 'Users friends table';
COMMENT ON COLUMN main.users_followers.follower IS 'Follower id foreign key';
COMMENT ON COLUMN main.users_followers.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.users_followers.creation_datetime IS 'Users friends binding creation datetime';


COMMIT;
