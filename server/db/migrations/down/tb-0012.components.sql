BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.components_l10n;
DROP TABLE main.components;

COMMIT;
