BEGIN TRANSACTION;
SET search_path TO main;

-- plugins --
CREATE TABLE main.plugins (
    plugin_id SMALLSERIAL NOT NULL,
    uid TEXT NOT NULL,
    CONSTRAINT plugins_plugin_id_pkey PRIMARY KEY (plugin_id),
    CONSTRAINT plugins_uid_ukey UNIQUE (uid)
);

COMMENT ON TABLE main.plugins IS 'Plugins table';
COMMENT ON COLUMN main.plugins.plugin_id IS 'Plugin id primary key';
COMMENT ON COLUMN main.plugins.uid IS 'Plugin uid';

-- plugins_l10n --
CREATE TABLE main.plugins_l10n (
    plugin_id INT2 NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    locale_id INT2 NOT NULL,
    CONSTRAINT plugins_l10n_plugin_id_fkey FOREIGN KEY (plugin_id) REFERENCES main.plugins(plugin_id),
    CONSTRAINT plugins_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id),
    CONSTRAINT plugins_l10n_plugin_id_locale_id_ukey UNIQUE (plugin_id, locale_id)
);

COMMENT ON TABLE main.plugins_l10n IS 'Plugins localized data table';
COMMENT ON COLUMN main.plugins_l10n.plugin_id IS 'Plugin id foreign key';
COMMENT ON COLUMN main.plugins_l10n.data IS 'Localized data';
COMMENT ON COLUMN main.plugins_l10n.locale_id IS 'Locale id foreign key';

-- projects_plugins --
CREATE TABLE main.projects_plugins (
    project_id INT4 NOT NULL,
    plugin_id INT4 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    public BOOL DEFAULT TRUE,
    CONSTRAINT projects_plugins_project_id_fkey FOREIGN KEY (project_id) REFERENCES main.projects(project_id),
    CONSTRAINT projects_plugins_plugin_id_fkey FOREIGN KEY (plugin_id) REFERENCES main.plugins(plugin_id)
);

COMMENT ON TABLE main.projects_plugins IS 'Projects plugins binding table';
COMMENT ON COLUMN main.projects_plugins.project_id IS 'Project id foreign key';
COMMENT ON COLUMN main.projects_plugins.plugin_id IS 'Project plugin id foreign key';
COMMENT ON COLUMN main.projects_plugins.creation_datetime IS 'Project plugin added timestamp';


COMMIT;
