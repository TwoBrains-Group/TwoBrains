export default {
    page: {
        user: {
            settings: {
                changeUid: 'Изменить уникальный идентификатор',
                changeLang: 'Изменить язык',
                changeAvatar: 'Изменить аватар',
                changeNickname: 'Изменить никнейм',
                changePassword: 'Изменить пароль',
                uidDescription: 'Этот идентификатор будет вашим url адресом',
                failedToLoadLocales: 'Не удалось загрузить языки',
            },
            _uid: {
                ideas: 'Идеи',
                follow: 'Подписаться',
                settings: 'Настройки',
                unfollow: 'Отписаться',
                following: 'Подписан',
                followingYou: 'Подписан на вас',
                mutuallyFollow: 'Стать друзьями',
                mutualFollowing: 'Вы друзья',
            },
        },
        idea: {
            index: {
                addOne: 'Добавить',
                noIdeasHere: 'Здесь нет идей',
            },
            create: {
                done: 'Готово',
                nameYourIdea: 'Назовите свою идею',
                myIdeaIsAbout: 'Моя идея заключается в...',
                addTags: 'Добавить теги',
            },
        },
        project: {
            _uid: {
                sections: {
                    home: 'Главная',
                    idea: 'Идеи',
                },
                description: 'Описание',
            },
        },
        auth: {
            auth: {
                password: 'Пароль',
                repeatPassword: 'Повторите пароль',
                orUseOtherAuthMethods: 'или используйте другой метод авторизации',
                login: 'Вход',
                signup: 'Регистрация',
                loginApply: 'Войти',
                signupApply: 'Зарегистрироваться',
                invalidPasswordMessage: 'Пароль должен быть длиннее 8 символов, содержать большие буквы, цифры и хотя бы один специальный символ',
                invalidEmailMessage: 'Неверный email',
            },
        },
    },

    cmp: {
        '*': {
            MainMenu: {
                home: 'Главная',
                about: 'О платформе',
                ideas: 'Идеи',
                projects: 'Проекты',
            },
            Header: {
                logout: 'Выйти',
                profile: 'Профиль',
                settings: 'Настройки',
                search: 'Поиск...',
                users: 'Пользователи',
                ideas: 'Идеи',
                noSearchResult: 'Нет результатов',
            },
            InputFile: {
                chooseFile: 'Выберите файл...',
            },
            Textarea: {
                moreToGo: 'Ещё {count} символов',
                tooLongBy: 'Слишком длинный на {count} символов',
                charactersLeft: '{count} символов осталось',
            },
            Input: {
                moreToGo: 'Ещё {count} символов',
                tooLongBy: 'Слишком длинный на {count} символов',
                charactersLeft: '{count} символов осталось',
            },
        },
        idea: {
            IdeaComment: {
                edit: 'Изменить',
                reply: 'Ответить',
                delete: 'Удалить',
                showReplies: 'Открыть ответы',
                closeReplies: 'Закрыть ответы',
                failedToReply: 'Не удалось ответить на комментарий',
                failedToLikeComment: 'Не удалось оценить комментарий',
                failedToLoadReplies: 'Не удалось загрузить ответы',
                failedToDeleteComment: 'Не удалось удалить комментарий',
                replySuccessfullyAdded: 'Ответ успешно добавлен',
                commentSuccessfullyDeleted: 'Комментарий успешно удален',
            },
            WriteComment: {
                writeAComment: 'Напишите комментарий...',
                commentSuccessfullyAdded: 'Комментарий успешно добавлен',
            },
            Idea: {
                edit: 'Изменить',
                delete: 'Удалить',
                failedToLoadComments: 'Не удалось загрузить комментарии',
            },
            IdeaList: {
                noMore: 'Больше нет...',
                noResult: 'Здесь нет идей',
                failedToLoadIdeas: 'Не удалось загрузить идеи',
            },
        },
        project: {
            Project: {
                createdBy: 'Создан',
            },
        },
    },

    entities: {
        tags: {
            lol: 'кек',
        },
        tagGroups: {
            meow: 'bitch',
        },
        plugins: {
            idea: 'Idea',
        },
    },
}
