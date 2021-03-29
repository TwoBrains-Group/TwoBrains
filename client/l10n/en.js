export default {
    page: {
        user: {
            settings: {
                changeUid: 'Change uid',
                changeLang: 'Change language',
                changeAvatar: 'Change avatar',
                changeNickname: 'Change nickname',
                changePassword: 'Change password',
                uidDescription: 'This identifier will be your url',
                failedToLoadLocales: 'Failed to load languages',
                newUniqueIdentifier: 'New unique identifier',
            },
            _uid: {
                ideas: 'Ideas',
                projects: 'Projects',
                follow: 'Follow',
                settings: 'Settings',
                unfollow: 'Unfollow',
                following: 'Following',
                followingYou: 'Following you',
                mutuallyFollow: 'Become friends',
                mutualFollowing: 'You\'re friends',
            },
        },
        idea: {
            index: {
                addOne: 'Add one',
                noIdeasHere: 'No ideas here',
            },
            create: {
                done: 'Done',
                nameYourIdea: 'Name your idea',
                myIdeaIsAbout: 'My idea is about...',
                addTags: 'Add tags',
            },
        },
        project: {
            _uid: {
                sections: {
                    home: 'Home',
                    idea: 'Ideas',
                },
                description: 'Description',
            },
            create: {
                nameYourProject: 'Name your project',
                done: 'Done',
                description: 'Describe it...',
                public: 'public',
                createProject: 'Create a new project',
                addTags: 'Add tags',
            },
        },
        auth: {
            auth: {
                password: 'Password',
                repeatPassword: 'Repeat password',
                orUseOtherAuthMethods: 'or use other auth methods',
                login: 'Log in',
                signup: 'Sign up',
                loginApply: 'Log in',
                signupApply: 'Create new account',
                invalidPasswordMessage: 'Password must be at least 8 characters long, contain upper case letters, digits and at least one special character',
                invalidEmailMessage: 'Invalid email',
            },
        },
    },

    cmp: {
        '*': {
            MainMenu: {
                home: 'Home',
                about: 'About',
                ideas: 'Ideas',
                projects: 'Projects',
            },
            Header: {
                logout: 'Log out',
                profile: 'Profile',
                settings: 'Settings',
                search: 'Search...',
                users: 'Users',
                ideas: 'Ideas',
                noSearchResult: 'No result',
            },
            InputFile: {
                chooseFile: 'Choose file...',
            },
            Textarea: {
                moreToGo: '{count} more to go',
                tooLongBy: 'Too long by {count} characters',
                charactersLeft: '{count} characters left',
            },
            Input: {
                moreToGo: '{count} more to go',
                tooLongBy: 'Too long by {count} characters',
                charactersLeft: '{count} characters left',
            },
            TagSearch: {
                defaultHeader: 'Add tags',
                searchTags: 'Search tags...',
            },
        },
        idea: {
            IdeaComment: {
                edit: 'Edit',
                reply: 'Reply',
                delete: 'Delete',
                showReplies: 'Show replies',
                closeReplies: 'Close replies',
                failedToReply: 'Failed to reply',
                failedToLikeComment: 'Failed to like comment',
                failedToLoadReplies: 'Failed to load replies',
                failedToDeleteComment: 'Failed to delete comment',
                replySuccessfullyAdded: 'Reply successfully added',
                commentSuccessfullyDeleted: 'Comment successfully deleted',
            },
            WriteComment: {
                writeAComment: 'Write a comment...',
                commentSuccessfullyAdded: 'Comment successfully added',
            },
            Idea: {
                edit: 'Edit',
                delete: 'Delete',
                failedToLoadComments: 'Failed to load comments',
            },
            IdeaList: {
                noMore: 'No more...',
                noResult: 'No ideas here',
                failedToLoadIdeas: 'Failed to load ideas',
            },
        },
        project: {
            Project: {
                createdBy: 'Created by',
            },
        },
    },

    entities: {
        tags: {
            lol: 'kek',
        },
        tagGroups: {
            meow: 'bitch',
        },
        plugins: {
            idea: {
                name: 'Idea',
                shortDescription: 'This plugin lets you create ideas on behalf of project',
            },
            test1: {
                name: 'Test test test 1 1 1',
                shortDescription: 'This is test plugin #1',
            },
            test2: {
                name: 'Test test test 2 2 2',
                shortDescription: 'This is test plugin #2',
            },
            test3: {
                name: 'Test test test 3 3 3',
                shortDescription: 'This is test plugin #3',
            },
        },
    },

    time: {
        ranges: {
            y: 'year',
            mth: 'month',
            d: 'day',
            h: 'hour',
            m: 'minute',
            s: 'seconds',
        },
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],
    },
}
