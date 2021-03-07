-- ideas --
DO $$
    DECLARE
        i int8;
        count int8 = 100;
    BEGIN
        FOR i in 0..count LOOP
            INSERT INTO
                main.ideas (user_id, name, text, creation_datetime)
            VALUES (1, main.random_string(64), main.random_string(512), (now() + i * '1 second'::interval)::timestamp);
        END LOOP;
END $$;
