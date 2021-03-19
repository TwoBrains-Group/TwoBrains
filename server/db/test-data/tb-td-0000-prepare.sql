

CREATE OR REPLACE FUNCTION main.random_string(length INTEGER, use_ws BOOL = TRUE, use_dot BOOL = TRUE) RETURNS TEXT
    LANGUAGE plpgsql
AS
$$
DECLARE
    result TEXT    := '';
    i      INTEGER := 0;
    rnd    INT;
    ch     VARCHAR;
BEGIN
    IF length < 0 THEN
        RAISE EXCEPTION 'Given length cannot be less than 0';
    END IF;
    FOR i IN 1..length
        LOOP
            rnd = random() * 100;
            CASE
                WHEN use_dot AND rnd < 3 THEN
                    ch = '. ';
                WHEN rnd > 5 AND rnd <= 25 THEN
                    ch = chr((65 + round(random() * 25))::INTEGER);
                WHEN rnd > 25 AND rnd <= 90 THEN
                    ch = chr((97 + round(random() * 25))::INTEGER);
                WHEN use_ws THEN
                    ch = chr(32);
                ELSE
                    i = i - 1;
                    CONTINUE;
                END CASE;

            result = result || ch;
        END LOOP;

    RETURN result;
END
$$;

ALTER FUNCTION random_string(INTEGER) OWNER TO postgres;
