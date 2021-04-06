BEGIN TRANSACTION;
SET search_path TO main;

DROP TYPE main.content_visibility;
DROP TYPE main.user_status;
DROP TYPE main.state;

COMMIT;
