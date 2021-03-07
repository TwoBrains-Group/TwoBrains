BEGIN TRANSACTION;
SET search_path TO main;

-- locales --
CREATE TABLE main.locales (
    locale_id SMALLSERIAL NOT NULL,
    code VARCHAR(2) NOT NULL,
    label TEXT NOT NULL,
    translatable BOOL NOT NULL DEFAULT FALSE,
    state main.states NOT NULL DEFAULT 'enabled'::main.states,
    "default" BOOL NOT NULL DEFAULT FALSE,
    CONSTRAINT locales_locale_id_pkey PRIMARY KEY (locale_id),
    CONSTRAINT locales_code_ukey UNIQUE (code)
);

CREATE UNIQUE INDEX locales_default_ukey ON main.locales("default") WHERE ("default" IS TRUE);

COMMENT ON TABLE main.locales IS 'Locales table';
COMMENT ON COLUMN main.locales.locale_id IS 'Locale id';
COMMENT ON COLUMN main.locales.code IS 'ISO 639-1 locale code';
COMMENT ON COLUMN main.locales.translatable IS 'Is used for content translation';
COMMENT ON COLUMN main.locales.state IS 'Locale state - enabled/disabled';

-- locales_l10n --
CREATE TABLE main.locales_l10n (
    locale_id INT2 NOT NULL,
    label TEXT NOT NULL,
    CONSTRAINT locales_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id),
    CONSTRAINT locales_l10n_locale_id_ukey UNIQUE (locale_id)
);

COMMENT ON TABLE main.locales_l10n IS 'Locales l10n data';
COMMENT ON COLUMN main.locales_l10n.label IS 'Locale localized label';

COMMIT;
