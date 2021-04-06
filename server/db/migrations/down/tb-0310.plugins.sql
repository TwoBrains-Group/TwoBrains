BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.projects_plugins;
DROP TABLE main.plugins_l10n;
DROP TABLE main.plugins;

COMMIT;
