BEGIN TRANSACTION;
SET search_path TO main;

DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS hstore;

COMMIT;