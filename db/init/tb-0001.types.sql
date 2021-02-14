BEGIN TRANSACTION;
SET search_path TO main;

-- User.status --
CREATE TYPE main.user_status
AS ENUM ('unverified', 'verified', 'deleted', 'blocked')
ON CONFLICT UPDATE;

COMMIT;