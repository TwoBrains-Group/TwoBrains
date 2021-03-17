BEGIN TRANSACTION;
SET search_path TO main;

-- tag_groups --
CREATE TABLE main.tag_groups (
    tag_group_id SERIAL2 NOT NULL,
    label TEXT NOT NULL,
    CONSTRAINT tag_groups_tag_group_id_pkey PRIMARY KEY (tag_group_id),
    CONSTRAINT tag_groups_label_ukey UNIQUE (label)
);

COMMENT ON TABLE main.tag_groups IS 'Tag groups table';
COMMENT ON COLUMN main.tag_groups.tag_group_id IS 'Tag group id';
COMMENT ON COLUMN main.tag_groups.label IS 'Tag group label';

-- tags --
CREATE TABLE main.tags (
    tag_id SERIAL2 NOT NULL,
    label TEXT NOT NULL,
    tag_group_id INT2,
    CONSTRAINT tags_tag_id_pkey PRIMARY KEY (tag_id),
    CONSTRAINT tags_label_ukey UNIQUE (label),
    CONSTRAINT tags_tag_group_id_fkey FOREIGN KEY (tag_group_id) REFERENCES main.tag_groups(tag_group_id)
);

COMMENT ON TABLE main.tags IS 'Tags table';
COMMENT ON COLUMN main.tags.tag_id IS 'Tag id';
COMMENT ON COLUMN main.tags.label IS 'Tag label';
COMMENT ON COLUMN main.tags.tag_group_id IS 'Tag group id';


COMMIT;
