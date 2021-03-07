BEGIN TRANSACTION;
SET search_path TO main;

CREATE TYPE main.state
AS ENUM ('enabled', 'disabled');

-- User.status --
CREATE TYPE main.user_status
AS ENUM ('unverified', 'verified', 'deleted', 'blocked');

COMMIT;
