BEGIN TRANSACTION;
SET search_path TO main;

-- state --
CREATE TYPE main.state
AS ENUM ('enabled', 'disabled');

-- user_status --
CREATE TYPE main.user_status
AS ENUM ('unverified', 'verified', 'deleted', 'blocked');

-- content_visibility --
CREATE TYPE main.content_visibility AS ENUM ('public', 'private', 'friends_only');

COMMIT;
