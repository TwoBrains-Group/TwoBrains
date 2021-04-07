export default `
BEGIN TRANSACTION;
SET search_path TO main;

TRUNCATE main.apps CASCADE;

DO
$$
    DECLARE
        -- locales --
{{localesDecl}}

        -- apps --
{{appsDecl}}

        -- pages --
{{pagesDecl}}

        -- components --
{{cmpsDecl}}

    BEGIN
        ----------
        -- APPS --
        ----------

{{appsQuery}}
        ---------------
        ---- PAGES ----
        ---------------

{{pagesQuery}}
        --------------------
        ---- COMPONENTS ----
        --------------------

{{cmpsQuery}}
END $$;

COMMIT;
`
