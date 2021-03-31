const fs = require('fs')
const en = require('./l10n/en')
const ru = require('./l10n/ru')

const loc = {en, ru}
const allData = {...en, ...ru}

const getKeys = (obj, depth = 1) => {
    if (typeof obj !== 'object') return obj

    const keys = []
    if (depth === 1) {
        return Object.keys(obj)
    } else {
        keys.push(...Object.values(obj).reduce((acc, so) => [...acc, ...getKeys(so, depth - 1)], []))
    }
    return keys
}

const apps = [...new Set([...Object.keys(allData).filter(app => !app.startsWith('_'))])]
const pages = Object.values(allData).reduce((acc, a) => [...acc, ...Object.keys(a)], [])
const cmps = Object.values(allData).reduce((acc, a) => {
    console.log('acc', acc)
    return acc.push(Object.values(a).reduce((pacc, p) => {
        console.log(p)
    }, []))
}, [])

const getAppName = a => `${a === '*' ? 'any' : a}_app`
const getPageName = p => `${p === '*' ? 'any' : p}_page`
const getLocaleName = l => `${l}_locale`
const getCmpName = c => `${c}_cmp`

const appsDecl = apps.map(a => {
    return `${getAppName(a)} INT2;`
}).join('\n')

const pagesDecl = pages.map(p => {
    return `${getPageName(p)} INT2;`
}).join('\n')

const localesDecl = Object.keys(loc).map(l => {
    return `${getLocaleName(l)} INT2 = (SELECT locale_id
                                     FROM main.locales
                                     WHERE code = '${l}');`
}).join('\n')


const query = `
BEGIN TRANSACTION;
SET search_path TO main;

DO
$$
    DECLARE
        any_app              INT2;
        user_app             INT2;
        idea_app             INT2;
        auth_app             INT2;
        project_app          INT2;
        any_page             INT2;
        user_profile_page    INT2;
        user_settings_page   INT2;
        idea_create_page     INT2;
        idea_index_page      INT2;
        project_project_page INT2;
        auth_auth_page       INT2;
        cmp                  INT4;
        enlocale             INT2 = (SELECT locale_id
                                     FROM main.locales
                                     WHERE code = 'en');
        rulocale             INT2 = (SELECT locale_id
                                     FROM main.locales
                                     WHERE code = 'ru');

    BEGIN
        ----------
        -- APPS --
        ----------

        INSERT INTO main.apps (name) VALUES ('*') RETURNING app_id INTO any_app;
        INSERT INTO main.apps (name) VALUES ('user') RETURNING app_id INTO user_app;
        INSERT INTO main.apps (name) VALUES ('idea') RETURNING app_id INTO idea_app;
        INSERT INTO main.apps (name) VALUES ('project') RETURNING app_id INTO project_app;
        INSERT INTO main.apps (name) VALUES ('auth') RETURNING app_id INTO auth_app;

        ---------------
        ---- PAGES ----
        ---------------

        -- * page --
        INSERT INTO main.pages (app_id, name) VALUES (any_app, '*') RETURNING page_id INTO any_page;

        -- user_settings page --
        INSERT INTO main.pages (app_id, name) VALUES (user_app, 'settings') RETURNING page_id INTO user_settings_page;

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (user_settings_page, enlocale, '{
            "changeNickname": "Change nickname",
            "changeAvatar": "Change avatar",
            "changeUid": "Change uid",
            "changePassword": "Change password",
            "uidDescription": "This identifier will be your url",
            "changeLang": "Change language",
            "failedToLoadLocales": "Failed to load languages"
        }');

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (user_settings_page, rulocale, '{
            "changeNickname": "Изменить никнейм",
            "changeAvatar": "Изменить аватар",
            "changeUid": "Изменить уникальный идентификатор",
            "changePassword": "Изменить пароль",
            "uidDescription": "Этот идентификатор будет вашим url адресом",
            "changeLang": "Изменить язык",
            "failedToLoadLocales": "Не удалось загрузить языки"
        }');

        -- user_profile page --
        INSERT INTO main.pages (app_id, name) VALUES (user_app, 'profile') RETURNING page_id INTO user_profile_page;

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (user_profile_page, enlocale, '{
            "following": "Following",
            "followingYou": "Following you",
            "mutualFollowing": "You''re friends",
            "unfollow": "Unfollow",
            "follow": "Follow",
            "settings": "Settings",
            "ideas": "Ideas",
            "mutuallyFollow": "Become friends"
        }');

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (user_profile_page, rulocale, '{
            "following": "Подписан",
            "followingYou": "Подписан на вас",
            "mutualFollowing": "Вы друзья",
            "unfollow": "Отписаться",
            "follow": "Подписаться",
            "settings": "Настройки",
            "ideas": "Идеи",
            "mutuallyFollow": "Стать друзьями"
        }');

        -- idea_index page --
        INSERT INTO main.pages (app_id, name) VALUES (idea_app, 'index') RETURNING page_id INTO idea_index_page;

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (idea_index_page, enlocale, '{
            "noIdeasHere": "No ideas here",
            "addOne": "Add one"
        }');

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (idea_index_page, rulocale, '{
            "noIdeasHere": "Здесь нет идей",
            "addOne": "Добавить"
        }');

        -- idea_create page --
        INSERT INTO main.pages (app_id, name) VALUES (idea_app, 'create') RETURNING page_id INTO idea_create_page;

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (idea_create_page, enlocale, '{
            "done": "Done",
            "myIdeaIsAbout": "My idea is about...",
            "nameYourIdea": "Name your idea"
        }');

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (idea_create_page, rulocale, '{
            "done": "Готово",
            "myIdeaIsAbout": "Моя идея заключается в...",
            "nameYourIdea": "Назовите свою идею"
        }');

        -- project_project page --
        INSERT INTO main.pages (app_id, name) VALUES (idea_app, 'project') RETURNING page_id INTO project_project_page;

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (project_project_page, enlocale, '{
            "description": "Description",
            "sections": {
                "idea": "Ideas",
                "home": "Home"
            }
        }');

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (project_project_page, rulocale, '{
            "description": "Описание",
            "sections": {
                "idea": "Идеи",
                "home": "Главная"
            }
        }');

        -- auth_auth page --
        INSERT INTO main.pages (app_id, name) VALUES (auth_app, 'auth') RETURNING page_id INTO auth_auth_page;

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (auth_auth_page, enlocale, '{
            "password": "Password",
            "repeatPassword": "Repeat password",
            "orUseOtherAuthMethods": "or use other auth methods"
        }');

        INSERT INTO main.pages_l10n (page_id, locale_id, data)
        VALUES (auth_auth_page, rulocale, '{
            "password": "Пароль",
            "repeatPassword": "Повторите пароль",
            "orUseOtherAuthMethods": "или используйте другой метод авторизации"
        }');

        --------------------
        ---- COMPONENTS ----
        --------------------

        -- *_MainMenu component --
        INSERT INTO main.components (app_id, name) VALUES (any_app, 'MainMenu') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "home": "Home",
            "ideas": "Ideas",
            "projects": "Projects",
            "about": "About"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "home": "Главная",
            "ideas": "Идеи",
            "projects": "Проекты",
            "about": "О платформе"
        }');

        -- *_Header component --
        INSERT INTO main.components (app_id, name) VALUES (any_app, 'Header') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "profile": "Profile",
            "settings": "Settings",
            "logout": "Log out"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "profile": "Профиль",
            "settings": "Настройки",
            "logout": "Выйти"
        }');

        -- *_InputFile component --
        INSERT INTO main.components (app_id, name) VALUES (any_app, 'InputFile') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "chooseFile": "Choose file..."
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "chooseFile": "Выберите файл..."
        }');

        -- *_Textarea component --
        INSERT INTO main.components (app_id, name) VALUES (any_app, 'Textarea') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "moreToGo": "more to go",
            "tooLongBy": "Too long by {count} characters",
            "charactersLeft": "characters left"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "moreToGo": "символов осталось",
            "tooLongBy": "Слишком длинный на {count} символов",
            "charactersLeft": "символов осталось"
        }');

        -- idea_IdeaComment component --
        INSERT INTO main.components (app_id, name) VALUES (idea_app, 'IdeaComment') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "delete": "Delete",
            "edit": "Edit",
            "showReplies": "Show replies",
            "closeReplies": "Close replies",
            "reply": "Reply",
            "failedToLikeComment": "Failed to like comment",
            "failedToLoadReplies": "Failed to load replies",
            "failedToDeleteComment": "Failed to delete comment",
            "failedToReply": "Failed to reply",
            "commentSuccessfullyDeleted": "Comment successfully deleted",
            "replySuccessfullyAdded": "Reply successfully added"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "delete": "Удалить",
            "edit": "Изменить",
            "showReplies": "Открыть ответы",
            "closeReplies": "Закрыть ответы",
            "reply": "Ответить",
            "failedToLikeComment": "Не удалось оценить комментарий",
            "failedToLoadReplies": "Не удалось загрузить ответы",
            "failedToDeleteComment": "Не удалось удалить комментарий",
            "failedToReply": "Не удалось ответить на комментарий",
            "commentSuccessfullyDeleted": "Комментарий успешно удален",
            "replySuccessfullyAdded": "Ответ успешно добавлен"
        }');

        -- idea_WriteComment component --
        INSERT INTO main.components (app_id, name) VALUES (idea_app, 'WriteComment') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "writeAComment": "Write a comment...",
            "commentSuccessfullyAdded": "Comment successfully added"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "writeAComment": "Напишите комментарий...",
            "commentSuccessfullyAdded": "Комментарий успешно добавлен"
        }');

        -- idea_Idea component --
        INSERT INTO main.components (app_id, name) VALUES (idea_app, 'Idea') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "failedToLoadComments": "Failed to load comments",
            "delete": "Delete",
            "edit": "Edit"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "failedToLoadComments": "Не удалось загрузить комментарии",
            "delete": "Удалить",
            "edit": "Изменить"
        }');

        -- idea_IdeaList component --
        INSERT INTO main.components (app_id, name) VALUES (idea_app, 'IdeaList') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "noResult": "No ideas here",
            "noMore": "No more...",
            "failedToLoadIdeas": "Failed to load ideas"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "noResult": "Здесь нет идей",
            "noMore": "Больше нет...",
            "failedToLoadIdeas": "Не удалось загрузить идеи"
        }');

        -- project_Project component --
        INSERT INTO main.components (app_id, name) VALUES (project_app, 'Project') RETURNING component_id INTO cmp;

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, enlocale, '{
            "createdBy": "Created by"
        }');

        INSERT INTO main.components_l10n (component_id, locale_id, data)
        VALUES (cmp, rulocale, '{
            "createdBy": "Создан"
        }');

    END
$$;

COMMIT;

`
