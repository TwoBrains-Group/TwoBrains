-- ideas-comments replies --
DO $$
    DECLARE
        i int8;
        count int8 = 100;
        iid int8;
        comment_id int8;
    BEGIN
        for iid in (select idea_id from main.ideas) loop
            for comment_id in (select idea_comment_id from main.ideas_comments where idea_id = iid) loop
                for i in 0..count loop
                    INSERT INTO
                        main.ideas_comments (idea_id, user_id, text, reply_to, creation_datetime)
                    VALUES (iid, 2, main.random_string(128), comment_id, (now() + i * '1 second'::interval)::timestamp);
                END LOOP;
            END LOOP;
        END LOOP;
END $$;
