BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.projects_users_rights;
DROP TABLE main.projects_tags;
DROP TABLE main.projects_likes;
DROP TABLE main.projects_users;
DROP TABLE main.projects;
DROP FUNCTION main.projects_tsv_update;
DROP TYPE main.project_state;

COMMIT;
