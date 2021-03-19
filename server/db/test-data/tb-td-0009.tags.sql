BEGIN TRANSACTION;
SET search_path TO main;

-- tag_groups --
DO $$
    DECLARE
        i int2;
    BEGIN
        FOR i IN 0..100 LOOP
            INSERT INTO main.tag_groups (label) VALUES (main.random_string(8, false, false));
        END LOOP;
END $$;

-- tags --
DO $$
    DECLARE
        i int2;
        group_id int2;
    BEGIN
        FOR group_id IN (SELECT tag_group_id FROM main.tag_groups) LOOP
            FOR i IN 0..100 LOOP
                INSERT INTO main.tags (label, tag_group_id) VALUES (main.random_string(8, false, false), group_id);
            END LOOP;
        END LOOP;
END $$;

COMMIT;
