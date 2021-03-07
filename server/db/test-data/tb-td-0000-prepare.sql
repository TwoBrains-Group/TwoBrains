CREATE FUNCTION random_string(length integer) RETURNS text
    LANGUAGE plpgsql
AS
$$
DECLARE
    result TEXT    := '';
    i      INTEGER := 0;
    rnd    INT;
    ch     varchar;
BEGIN
    IF length < 0 THEN
        RAISE EXCEPTION 'Given length cannot be less than 0';
    END IF;
    FOR i IN 1..length
        LOOP
            rnd = random() * 100;
            CASE
                WHEN rnd < 3 THEN
                    ch = '. ';
                WHEN rnd > 5 AND rnd <= 25 THEN
                    ch = chr((65 + round(random() * 25))::INTEGER);
                WHEN rnd > 25 AND rnd <= 90 THEN
                    ch = chr((97 + round(random() * 25))::INTEGER);
                ELSE
                    ch = chr(32);
                END CASE;

            result = result || ch;
        END LOOP;

    RETURN result;
END
$$;

ALTER FUNCTION random_string(INTEGER) OWNER TO postgres;

