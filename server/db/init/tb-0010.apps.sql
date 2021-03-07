BEGIN TRANSACTION;
SET search_path TO main;

CREATE TABLE main.apps (
    app_id SMALLSERIAL NOT NUll,
    name TEXT,
    CONSTRAINT apps_app_id_pkey PRIMARY KEY (app_id),
    CONSTRAINT apps_name_ukey UNIQUE (name)
);

COMMENT ON TABLE main.apps IS 'Apps table';
COMMENT ON COLUMN main.apps.app_id IS 'App id primary key';
COMMENT ON COLUMN main.apps.name IS 'App name';

COMMIT;
