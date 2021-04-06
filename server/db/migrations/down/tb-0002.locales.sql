BEGIN TRANSACTION;
SET search_path TO main;

DROP TABLE main.locales_l10n;
DROP TABLE main.locales;

DROP FUNCTION main.get_default_locale;

COMMIT;
