BEGIN TRANSACTION;
SET search_path TO main;

-- components --
CREATE TABLE main.components (
    component_id SERIAL2 NOT NULL,
    app_id INT2 DEFAULT NULL,
    name TEXT NOT NULL,
    CONSTRAINT components_component_id_pkey PRIMARY KEY (component_id),
    CONSTRAINT components_app_id_fkey FOREIGN KEY (app_id) REFERENCES main.apps(app_id),
    CONSTRAINT components_app_id_component_id_ukey UNIQUE (app_id, name)
);

COMMENT ON TABLE main.components IS 'Components table';
COMMENT ON COLUMN main.components.app_id IS 'Component app id';
COMMENT ON COLUMN main.components.name IS 'Component name';

-- components_l10n --
--CREATE TABLE main.components_l10n (
--    component_id INT2 NOT NULL,
--    locale_id INT2 NOT NULL,
--    data JSONB NOT NULL DEFAULT '{}',
--    CONSTRAINT components_l10n_component_id_fkey FOREIGN KEY (component_id) REFERENCES main.components(component_id),
--    CONSTRAINT components_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id),
--    CONSTRAINT components_l10n_component_id_locale_id UNIQUE (component_id, locale_id)
--);
--
--COMMENT ON TABLE main.components_l10n IS 'Components localization table';
--COMMENT ON COLUMN main.components_l10n.component_id IS 'Component id';
--COMMENT ON COLUMN main.components_l10n.locale_id IS 'Locale id';
--COMMENT ON COLUMN main.components_l10n.data IS 'Component localized data';

COMMIT;
