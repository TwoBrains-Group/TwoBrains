import {actions as authActions} from './auth'

export const actions = {
    async nuxtServerInit(...args) {
        await authActions.nuxtServerInit(...args)
    }
}
