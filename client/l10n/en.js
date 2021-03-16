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
}
