BEGIN TRANSACTION;
SET search_path TO main;

-- common_l10n --
CREATE TABLE main.common_l10n (
    name TEXT NOT NULL,
    locale_id INT2 NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT common_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales (locale_id),
    CONSTRAINT common_l10n_name_ukey UNIQUE (name)
);

COMMENT ON TABLE main.common_l10n IS 'Common entities l10n data table';
COMMENT ON COLUMN main.common_l10n.locale_id IS 'Locale id';
COMMENT ON COLUMN main.common_l10n.name IS 'Entity name';
COMMENT ON COLUMN main.common_l10n.data IS 'Entity localized data';


COMMIT;
