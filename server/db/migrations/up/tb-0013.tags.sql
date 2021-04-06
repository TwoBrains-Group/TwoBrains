BEGIN TRANSACTION;
SET search_path TO main;

----------------
-- tag_groups --
----------------
CREATE TABLE main.tag_groups (
    tag_group_id SERIAL2 NOT NULL,
    label TEXT NOT NULL,
    tsv tsvector NOT NULL,
    CONSTRAINT tag_groups_tag_group_id_pkey PRIMARY KEY (tag_group_id),
    CONSTRAINT tag_groups_label_ukey UNIQUE (label)
);

COMMENT ON TABLE main.tag_groups IS 'Tag groups table';
COMMENT ON COLUMN main.tag_groups.tag_group_id IS 'Tag group id';
COMMENT ON COLUMN main.tag_groups.label IS 'Tag group label';
COMMENT ON COLUMN main.tag_groups.tsv IS 'Tag tsvector for search';

CREATE TABLE main.tag_groups_l10n (
    tag_group_id INT2 NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    locale_id INT2 NOT NULL,
    CONSTRAINT tag_groups_l10n_tag_group_id_fkey FOREIGN KEY (tag_group_id) REFERENCES main.tag_groups(tag_group_id),
    CONSTRAINT tag_groups_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id)
);

COMMENT ON TABLE main.tag_groups_l10n IS 'Tag groups localized data';
COMMENT ON COLUMN main.tag_groups_l10n.tag_group_id IS 'Tag group id';
COMMENT ON COLUMN main.tag_groups_l10n.data IS 'Tag group localized data';
COMMENT ON COLUMN main.tag_groups_l10n.locale_id IS 'Tag group l10n locale id';

-- tag_groups_tsv_idx --
CREATE INDEX tag_groups_tsv_idx ON main.tag_groups USING gin(tsv);

-- tag_groups_tsv_update --
CREATE FUNCTION main.tag_groups_tsv_update() RETURNS trigger AS $$
BEGIN
    new.tsv = setweight(to_tsvector(new.label), 'A');
    return new;
END
$$ LANGUAGE plpgsql;

-- tag_groups_tsv_update_trigger --
CREATE TRIGGER tag_groups_tsv_update_trigger BEFORE INSERT OR UPDATE
ON main.tag_groups FOR EACH ROW EXECUTE PROCEDURE main.tag_groups_tsv_update();

----------
-- tags --
----------
CREATE TABLE main.tags (
    tag_id SERIAL2 NOT NULL,
    label TEXT NOT NULL,
    tag_group_id INT2,
    tsv tsvector NOT NULL,
    CONSTRAINT tags_tag_id_pkey PRIMARY KEY (tag_id),
    CONSTRAINT tags_label_ukey UNIQUE (label),
    CONSTRAINT tags_tag_group_id_fkey FOREIGN KEY (tag_group_id) REFERENCES main.tag_groups(tag_group_id)
);

COMMENT ON TABLE main.tags IS 'Tags table';
COMMENT ON COLUMN main.tags.tag_id IS 'Tag id';
COMMENT ON COLUMN main.tags.label IS 'Tag label';
COMMENT ON COLUMN main.tags.tag_group_id IS 'Tag group id';

CREATE TABLE main.tags_l10n (
    tag_id INT2 NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    locale_id INT2 NOT NULL,
    CONSTRAINT tags_l10n_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES main.tags(tag_id),
    CONSTRAINT tags_l10n_locale_id_fkey FOREIGN KEY (locale_id) REFERENCES main.locales(locale_id)
);

COMMENT ON TABLE main.tags_l10n IS 'Tags localized data table';
COMMENT ON COLUMN main.tags_l10n.tag_id IS 'Tags l10n tag id';
COMMENT ON COLUMN main.tags_l10n.data IS 'Tag localized data';
COMMENT ON COLUMN main.tags_l10n.locale_id IS 'Tag l10n locale id';

-- tags_tsv_idx --
CREATE INDEX tags_tsv_idx ON main.tags USING gin(tsv);

-- tags_tsv_update --
CREATE FUNCTION main.tags_tsv_update() RETURNS trigger AS $$
BEGIN
    new.tsv = setweight(to_tsvector(new.label), 'A');
    return new;
END
$$ LANGUAGE plpgsql;

-- tags_tsv_update_trigger --
CREATE TRIGGER tags_tsv_update_trigger BEFORE INSERT OR UPDATE
ON main.tags FOR EACH ROW EXECUTE PROCEDURE main.tags_tsv_update();


COMMIT;
