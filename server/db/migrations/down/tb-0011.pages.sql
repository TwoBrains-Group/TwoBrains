BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.pages_l10n;
DROP TABLE main.pages;

COMMIT;
