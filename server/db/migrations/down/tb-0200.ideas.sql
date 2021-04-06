BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.ideas_tags;
DROP TABLE main.ideas_comments_likes;
DROP TABLE main.ideas_comments;
DROP TABLE main.ideas_likes;
DROP TABLE main.ideas;
DROP FUNCTION main.ideas_tsv_update;
DROP TYPE main.idea_relation;

COMMIT;
