BEGIN TRANSACTION;
SET search_path TO main;

-- ideas --
DO $$
    DECLARE
        i int8;
        count int8 = 100;
        tags RECORD
    BEGIN
        FOR i in 0..count LOOP
            INSERT INTO
                main.ideas (user_id, name, text, creation_datetime)
            VALUES (2, main.random_string(64), main.random_string(512), (now() + i * '1 second'::interval)::timestamp);
        END LOOP;
END $$;

-- ideas_tags --
DO $$
    DECLARE
        tid int2;
        iid int8;
        tags int2[];
        tags_count int2 = 5;
    BEGIN
        FOR iid IN (SELECT idea_id FROM main.ideas) LOOP
            tags = (SELECT ARRAY(SELECT tag_id FROM main.tags LIMIT tags_count));
            FOREACH tid IN ARRAY tags LOOP
                INSERT INTO main.ideas_tags (idea_id, tag_id) VALUES (iid, tags[tid]);
            END LOOP;
        END LOOP;
END $$;


COMMIT;
