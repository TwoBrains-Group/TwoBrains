BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.users_followers;
DROP TABLE main.users;

DROP TYPE main.user_role;
DROP FUNCTION main.users_tsv_update;

COMMIT;
