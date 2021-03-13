BEGIN TRANSACTION;
SET search_path TO main;

-- pages --
CREATE TABLE main.pages (
    page_id SERIAL2 NOT NULL,
    app_id INT2 NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT pages_page_id_pkey PRIMARY KEY (page_id),
    CONSTRAINT pages_app_id_fkey FOREIGN KEY (app_id) REFERENCES main.apps(app_id),
    CONSTRAINT pages_app_name_name_ukey UNIQUE (app_id, name)
);

COMMENT ON TABLE main.pages IS 'Pages table';
COMMENT ON COLUMN main.pages.page_id IS 'Page id primary key';
COMMENT ON COLUMN main.pages.app_id IS 'App id foreign key';
COMMENT ON COLUMN main.pages.name IS 'Page name';

-- pages_l10n --
CREATE TABLE main.pages_l10n (
    page_id INT2 NOT NULL,
    locale_id INT2 NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT pages_l10n_page_id_fkey FOREIGN KEY (page_id) REFERENCES main.pages(page_id),
    CONSTRAINT pages_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id),
    CONSTRAINT pages_l10n_page_id_locale_id UNIQUE (page_id, locale_id)
);

COMMENT ON TABLE main.pages_l10n IS 'Pages localization table';
COMMENT ON COLUMN main.pages_l10n.page_id IS 'Page id';
COMMENT ON COLUMN main.pages_l10n.locale_id IS 'Locale id';
COMMENT ON COLUMN main.pages_l10n.data IS 'Page localized data';

COMMIT;
