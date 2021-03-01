const cookieParser = process.server ? require('cookieparser') : undefined

export const state = () => ({
    userData: {},
    token: null,
})

export const mutations = {
    setAuth(state, authData) {
        if (!authData) {
            state.userData = {}
            state.token = null
            return
        }

        const {userData, token} = authData

        state.userData = {...state.userData, ...userData}
        state.token = token
    },

    setUserData(state, userData) {
        state.userData = {...state.userData, ...userData}
    }
}

export const getters = {
    loggedInUser(state) {
        return state.userData
    },
}

export const actions = {
    async nuxtServerInit ({commit}, {req}) {
        let auth = null
        if (req.headers.cookie) {
            const parsed = cookieParser.parse(req.headers.cookie)
            try {
                auth = JSON.parse(parsed.auth)
            } catch (err) {
                console.log('No valid cookie found')
            }
        }
        commit('auth/setAuth', auth)
    }
}
