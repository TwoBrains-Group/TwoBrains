BEGIN TRANSACTION;
SET search_path TO main;

TRUNCATE main.apps CASCADE;

DO
$$
    DECLARE
        -- locales --
		en_locale INT2 = (SELECT locale_id
                         FROM main.locales
                         WHERE code = 'en');
		ru_locale INT2 = (SELECT locale_id
                         FROM main.locales
                         WHERE code = 'ru');

        -- apps --
		user_app INT2;
		idea_app INT2;
		project_app INT2;
		auth_app INT2;
		any_app INT2;

        -- pages --
		user_app_settings_page INT2;
		user_app__uid_page INT2;
		idea_app_index_page INT2;
		idea_app_create_page INT2;
		project_app__uid_page INT2;
		project_app_create_page INT2;
		auth_app_auth_page INT2;

        -- components --
		any_app_MainMenu_cmp INT2;
		any_app_Header_cmp INT2;
		any_app_InputFile_cmp INT2;
		any_app_Textarea_cmp INT2;
		any_app_Input_cmp INT2;
		any_app_TagSearch_cmp INT2;
		idea_app_IdeaComment_cmp INT2;
		idea_app_WriteComment_cmp INT2;
		idea_app_Idea_cmp INT2;
		idea_app_IdeaList_cmp INT2;
		project_app_Project_cmp INT2;

    BEGIN
        ----------
        -- APPS --
        ----------

		-- user --
		INSERT INTO main.apps (name) VALUES ('user') RETURNING app_id INTO user_app;
		-- idea --
		INSERT INTO main.apps (name) VALUES ('idea') RETURNING app_id INTO idea_app;
		-- project --
		INSERT INTO main.apps (name) VALUES ('project') RETURNING app_id INTO project_app;
		-- auth --
		INSERT INTO main.apps (name) VALUES ('auth') RETURNING app_id INTO auth_app;
		-- * --
		INSERT INTO main.apps (name) VALUES ('*') RETURNING app_id INTO any_app;

        ---------------
        ---- PAGES ----
        ---------------

		-- user_settings --
		INSERT INTO main.pages (app_id, name) VALUES (user_app, 'settings') RETURNING page_id INTO user_app_settings_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (user_app_settings_page, en_locale, '{
			"changeUid": "Change uid",
			"changeLang": "Change language",
			"changeAvatar": "Change avatar",
			"changeNickname": "Change nickname",
			"changePassword": "Change password",
			"uidDescription": "This identifier will be your url",
			"failedToLoadLocales": "Failed to load languages",
			"newUniqueIdentifier": "New unique identifier"
		}');

		-- user__uid --
		INSERT INTO main.pages (app_id, name) VALUES (user_app, '_uid') RETURNING page_id INTO user_app__uid_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (user_app__uid_page, en_locale, '{
			"ideas": "Ideas",
			"projects": "Projects",
			"follow": "Follow",
			"settings": "Settings",
			"unfollow": "Unfollow",
			"following": "Following",
			"followingYou": "Following you",
			"mutuallyFollow": "Become friends",
			"mutualFollowing": "You''re friends"
		}');

		-- idea_index --
		INSERT INTO main.pages (app_id, name) VALUES (idea_app, 'index') RETURNING page_id INTO idea_app_index_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (idea_app_index_page, en_locale, '{
			"addOne": "Add one",
			"noIdeasHere": "No ideas here"
		}');

		-- idea_create --
		INSERT INTO main.pages (app_id, name) VALUES (idea_app, 'create') RETURNING page_id INTO idea_app_create_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (idea_app_create_page, en_locale, '{
			"done": "Done",
			"nameYourIdea": "Name your idea",
			"myIdeaIsAbout": "My idea is about...",
			"addTags": "Add tags"
		}');

		-- project__uid --
		INSERT INTO main.pages (app_id, name) VALUES (project_app, '_uid') RETURNING page_id INTO project_app__uid_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (project_app__uid_page, en_locale, '{
			"sections": {
						"home": "Home",
						"idea": "Ideas"
			},
			"description": "Description"
		}');

		-- project_create --
		INSERT INTO main.pages (app_id, name) VALUES (project_app, 'create') RETURNING page_id INTO project_app_create_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (project_app_create_page, en_locale, '{
			"nameYourProject": "Name your project",
			"done": "Done",
			"description": "Describe it...",
			"public": "public",
			"private": "private",
			"createProject": "Create a new project",
			"addTags": "Add tags",
			"addPlugins": "Add plugins"
		}');

		-- auth_auth --
		INSERT INTO main.pages (app_id, name) VALUES (auth_app, 'auth') RETURNING page_id INTO auth_app_auth_page;
		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (auth_app_auth_page, en_locale, '{
			"password": "Password",
			"repeatPassword": "Repeat password",
			"orUseOtherAuthMethods": "or use other auth methods",
			"login": "Log in",
			"signup": "Sign up",
			"loginApply": "Log in",
			"signupApply": "Create new account",
			"invalidPasswordMessage": "Password must be at least 8 characters long, contain upper case letters, digits and at least one special character",
			"invalidEmailMessage": "Invalid email"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (user_app_settings_page, ru_locale, '{
			"changeUid": "Изменить уникальный идентификатор",
			"changeLang": "Изменить язык",
			"changeAvatar": "Изменить аватар",
			"changeNickname": "Изменить никнейм",
			"changePassword": "Изменить пароль",
			"uidDescription": "Этот идентификатор будет вашим url адресом",
			"failedToLoadLocales": "Не удалось загрузить языки",
			"newUniqueIdentifier": "Новый уникальный идентификатор"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (user_app__uid_page, ru_locale, '{
			"ideas": "Идеи",
			"follow": "Подписаться",
			"settings": "Настройки",
			"unfollow": "Отписаться",
			"following": "Подписан",
			"followingYou": "Подписан на вас",
			"mutuallyFollow": "Стать друзьями",
			"mutualFollowing": "Вы друзья",
			"projects": "Проекты"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (idea_app_index_page, ru_locale, '{
			"addOne": "Добавить",
			"noIdeasHere": "Здесь нет идей"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (idea_app_create_page, ru_locale, '{
			"done": "Готово",
			"nameYourIdea": "Назовите свою идею",
			"myIdeaIsAbout": "Моя идея заключается в...",
			"addTags": "Добавить теги"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (project_app__uid_page, ru_locale, '{
			"sections": {
						"home": "Главная",
						"idea": "Идеи"
			},
			"description": "Описание"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (project_app_create_page, ru_locale, '{
			"nameYourProject": "Назовите свой проект",
			"done": "Готово",
			"description": "Опишите проект...",
			"public": "публичный",
			"private": "личный",
			"createProject": "Создать проект",
			"addTags": "Добавить теги"
		}');

		INSERT INTO main.pages_l10n (page_id, locale_id, data)
		VALUES (auth_app_auth_page, ru_locale, '{
			"password": "Пароль",
			"repeatPassword": "Повторите пароль",
			"orUseOtherAuthMethods": "или используйте другой метод авторизации",
			"login": "Вход",
			"signup": "Регистрация",
			"loginApply": "Войти",
			"signupApply": "Зарегистрироваться",
			"invalidPasswordMessage": "Пароль должен быть длиннее 8 символов, содержать большие буквы, цифры и хотя бы один специальный символ",
			"invalidEmailMessage": "Неверный email"
		}');


        --------------------
        ---- COMPONENTS ----
        --------------------

		-- *_MainMenu --
		INSERT INTO main.components (app_id, name) VALUES (any_app, 'MainMenu') RETURNING component_id INTO any_app_MainMenu_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_MainMenu_cmp, en_locale, '{
			"home": "Home",
			"about": "About",
			"ideas": "Ideas",
			"projects": "Projects"
		}');

		-- *_Header --
		INSERT INTO main.components (app_id, name) VALUES (any_app, 'Header') RETURNING component_id INTO any_app_Header_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_Header_cmp, en_locale, '{
			"logout": "Log out",
			"profile": "Profile",
			"settings": "Settings",
			"search": "Search...",
			"users": "Users",
			"ideas": "Ideas",
			"noSearchResult": "No result"
		}');

		-- *_InputFile --
		INSERT INTO main.components (app_id, name) VALUES (any_app, 'InputFile') RETURNING component_id INTO any_app_InputFile_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_InputFile_cmp, en_locale, '{
			"chooseFile": "Choose file..."
		}');

		-- *_Textarea --
		INSERT INTO main.components (app_id, name) VALUES (any_app, 'Textarea') RETURNING component_id INTO any_app_Textarea_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_Textarea_cmp, en_locale, '{
			"moreToGo": "{count} more to go",
			"tooLongBy": "Too long by {count} characters",
			"charactersLeft": "{count} characters left"
		}');

		-- *_Input --
		INSERT INTO main.components (app_id, name) VALUES (any_app, 'Input') RETURNING component_id INTO any_app_Input_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_Input_cmp, en_locale, '{
			"moreToGo": "{count} more to go",
			"tooLongBy": "Too long by {count} characters",
			"charactersLeft": "{count} characters left"
		}');

		-- *_TagSearch --
		INSERT INTO main.components (app_id, name) VALUES (any_app, 'TagSearch') RETURNING component_id INTO any_app_TagSearch_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_TagSearch_cmp, en_locale, '{
			"defaultHeader": "Add tags",
			"searchTags": "Search tags..."
		}');

		-- idea_IdeaComment --
		INSERT INTO main.components (app_id, name) VALUES (idea_app, 'IdeaComment') RETURNING component_id INTO idea_app_IdeaComment_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_IdeaComment_cmp, en_locale, '{
			"edit": "Edit",
			"reply": "Reply",
			"delete": "Delete",
			"showReplies": "Show replies",
			"closeReplies": "Close replies",
			"failedToReply": "Failed to reply",
			"failedToLikeComment": "Failed to like comment",
			"failedToLoadReplies": "Failed to load replies",
			"failedToDeleteComment": "Failed to delete comment",
			"replySuccessfullyAdded": "Reply successfully added",
			"commentSuccessfullyDeleted": "Comment successfully deleted"
		}');

		-- idea_WriteComment --
		INSERT INTO main.components (app_id, name) VALUES (idea_app, 'WriteComment') RETURNING component_id INTO idea_app_WriteComment_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_WriteComment_cmp, en_locale, '{
			"writeAComment": "Write a comment...",
			"commentSuccessfullyAdded": "Comment successfully added"
		}');

		-- idea_Idea --
		INSERT INTO main.components (app_id, name) VALUES (idea_app, 'Idea') RETURNING component_id INTO idea_app_Idea_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_Idea_cmp, en_locale, '{
			"edit": "Edit",
			"delete": "Delete",
			"failedToLoadComments": "Failed to load comments"
		}');

		-- idea_IdeaList --
		INSERT INTO main.components (app_id, name) VALUES (idea_app, 'IdeaList') RETURNING component_id INTO idea_app_IdeaList_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_IdeaList_cmp, en_locale, '{
			"noMore": "No more...",
			"noResult": "No ideas here",
			"failedToLoadIdeas": "Failed to load ideas"
		}');

		-- project_Project --
		INSERT INTO main.components (app_id, name) VALUES (project_app, 'Project') RETURNING component_id INTO project_app_Project_cmp;
		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (project_app_Project_cmp, en_locale, '{
			"createdBy": "Created by"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_MainMenu_cmp, ru_locale, '{
			"home": "Главная",
			"about": "О платформе",
			"ideas": "Идеи",
			"projects": "Проекты"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_Header_cmp, ru_locale, '{
			"logout": "Выйти",
			"profile": "Профиль",
			"settings": "Настройки",
			"search": "Поиск...",
			"users": "Пользователи",
			"ideas": "Идеи",
			"noSearchResult": "Нет результатов"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_InputFile_cmp, ru_locale, '{
			"chooseFile": "Выберите файл..."
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_Textarea_cmp, ru_locale, '{
			"moreToGo": "Ещё {count} символов",
			"tooLongBy": "Слишком длинный на {count} символов",
			"charactersLeft": "{count} символов осталось"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_Input_cmp, ru_locale, '{
			"moreToGo": "Ещё {count} символов",
			"tooLongBy": "Слишком длинный на {count} символов",
			"charactersLeft": "{count} символов осталось"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (any_app_TagSearch_cmp, ru_locale, '{
			"defaultHeader": "Добавить теги",
			"searchTags": "Искать теги"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_IdeaComment_cmp, ru_locale, '{
			"edit": "Изменить",
			"reply": "Ответить",
			"delete": "Удалить",
			"showReplies": "Открыть ответы",
			"closeReplies": "Закрыть ответы",
			"failedToReply": "Не удалось ответить на комментарий",
			"failedToLikeComment": "Не удалось оценить комментарий",
			"failedToLoadReplies": "Не удалось загрузить ответы",
			"failedToDeleteComment": "Не удалось удалить комментарий",
			"replySuccessfullyAdded": "Ответ успешно добавлен",
			"commentSuccessfullyDeleted": "Комментарий успешно удален"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_WriteComment_cmp, ru_locale, '{
			"writeAComment": "Напишите комментарий...",
			"commentSuccessfullyAdded": "Комментарий успешно добавлен"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_Idea_cmp, ru_locale, '{
			"edit": "Изменить",
			"delete": "Удалить",
			"failedToLoadComments": "Не удалось загрузить комментарии"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (idea_app_IdeaList_cmp, ru_locale, '{
			"noMore": "Больше нет...",
			"noResult": "Здесь нет идей",
			"failedToLoadIdeas": "Не удалось загрузить идеи"
		}');

		INSERT INTO main.components_l10n (component_id, locale_id, data)
		VALUES (project_app_Project_cmp, ru_locale, '{
			"createdBy": "Создан"
		}');


END $$;

COMMIT;