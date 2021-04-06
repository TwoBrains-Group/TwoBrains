BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.tags_l10n;
DROP TABLE main.tags;
DROP TABLE main.tag_groups_l10n;
DROP TABLE main.tag_groups;

DROP FUNCTION main.tag_groups_tsv_update;
DROP FUNCTION main.tags_tsv_update;

COMMIT;
