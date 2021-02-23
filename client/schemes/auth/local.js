import {LocalScheme, HTTPRequest} from '@nuxtjs/auth-next'

export default class LocalAuth extends LocalScheme {
    async fetchUser(endpoint) {
        if (!this.check().valid) {
            return
        }

        if (!this.options.endpoints.user) {
            this.$auth.setUser({})
            return
        }

        return this.$auth.requestWith(
            this.name,
            endpoint,
            this.options.endpoints.user
        ).then((response) => {
            const user = response.data.user

            const customUser = {
                ...user,
                fullName: user.firstName + ' ' + user.lastName,
                roles: ['user']
            }

            this.$auth.setUser(customUser)

            return response
        }).catch((error) => {
            this.$auth.callOnError(error, { method: 'fetchUser' })
        })
    }
}
