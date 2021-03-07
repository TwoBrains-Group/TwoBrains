-- TRUNCATE TABLE main.apps CASCADE;

BEGIN TRANSACTION;
SET search_path TO main;

DO $$
    DECLARE
        any_app int2;
        any_page int2;
        user_app int2;
        user_settings_page int2;

        cmp int4;
        enLocale int2 = (SELECT locale_id FROM main.locales WHERE code = 'en');
        ruLocale int2 = (SELECT locale_id FROM main.locales WHERE code = 'ru');

    BEGIN
        ----------
        -- APPS --
        ----------

        INSERT INTO main.apps (name) VALUES ('*');
        any_app = (SELECT app_id FROM main.apps WHERE name = '*');

        INSERT INTO main.apps (name) VALUES ('user');
        user_app = (SELECT app_id FROM main.apps WHERE name = 'user');

        ---------------
        ---- PAGES ----
        ---------------

        -- any --
        INSERT INTO main.pages (app_id, name) VALUES (any_app, '*');
        any_page = (SELECT page_id from main.pages where name = '*');

        -- Settings --
        INSERT INTO main.pages (app_id, name) VALUES (user_app, 'settings');
        user_settings_page = (SELECT page_id FROM main.pages WHERE name = 'settings' AND app_id = user_app);

        /**

                'changeNickname',
                'changeAvatar',
                'changeUid',
                'changePassword',
         */
        INSERT INTO main.pages_l10n (page_id, locale_id, data) VALUES (user_settings_page, enlocale, '{"changeNickname": "Change nickname", "changeAvatar": "Change avatar", "changeUid": "Change uid", "changePassword": "Change password", "uidDescription": "This identifier will be your url"}');

        --------------------
        ---- COMPONENTS ----
        --------------------

        -- MainMenu --
        INSERT INTO main.components (page_id, name) VALUES (any_page, 'MainMenu');
        cmp = (SELECT component_id FROM main.components WHERE name = 'MainMenu');

        INSERT INTO main.components_l10n (component_id, locale_id, data) VALUES (cmp, enlocale, '{"home": "Home", "ideas": "Ideas", "about": "About"}');
        INSERT INTO main.components_l10n (component_id, locale_id, data) VALUES (cmp, rulocale, '{"home": "Главная", "ideas": "Идеи", "about": "О платформе"}');

        -- Header --
        INSERT INTO main.components (page_id, name) VALUES (any_page, 'Header');
        cmp = (SELECT component_id FROM main.components WHERE name = 'Header');

        INSERT INTO main.components_l10n (component_id, locale_id, data) VALUES (cmp, enlocale, '{"profile": "Profile", "settings": "Settings", "logout": "Log out"}');
        INSERT INTO main.components_l10n (component_id, locale_id, data) VALUES (cmp, rulocale, '{"profile": "Профиль", "settings": "Настройки", "logout": "Выйти"}');

END $$;

COMMIT;
