BEGIN TRANSACTION;
SET search_path TO main;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA main;

COMMIT;