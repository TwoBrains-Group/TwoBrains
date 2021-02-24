const cookieParser = process.server ? require('cookieparser') : undefined

export const state = () => ({
    auth: null
})

export const mutations = {
    setAuth (state, auth) {
        state.auth = auth
    }
}

export const getters = {
    loggedInUser(state) {
        return state.auth.userData
    }
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
