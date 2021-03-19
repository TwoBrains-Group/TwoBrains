-- ideas-comments --
DO $$
    DECLARE
        i int8;
        count int8 = 100;
        iid int;
    BEGIN
        for iid in (select idea_id from main.ideas) loop
            FOR i in 0..count LOOP
                INSERT INTO
                    main.ideas_comments (idea_id, user_id, text, reply_to, creation_datetime)
                VALUES (iid, 2, main.random_string(128), null, (now() + i * '1 second'::interval)::timestamp);
            END LOOP;
        END LOOP;
END $$;
