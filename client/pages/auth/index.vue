<template>
    <div class="auth-window">
        <header class="base-btn auth-window__header" @click="switchAuthType()">
            <h3 class="auth-window__header_h auth-window__header_h--login" :class="login ? 'chosen' : ''">Login</h3>
            <h3 class="auth-window__header_h auth-window__header_h--signup" :class="!login ? 'chosen' : ''">Sign up</h3>
        </header>

        <div class="auth-window__body auth-window__body--login" v-if="login">
            <input type="email" placeholder="email" v-model="fields.loginEmail">

            <input type="password" :placeholder="l10n.password" v-model="fields.loginPassword">

            <div class="material-btn auth-window__body__accept" @click="loginLocal()">Login</div>
        </div>

        <div class="auth-window__body auth-window__body--signup" v-if="!login">
            <input type="email" placeholder="email" v-model="fields.signupEmail">

            <input type="password" :placeholder="l10n.password" v-model="fields.signupPassword">

            <input type="password" :placeholder="l10n.repeatPassword" v-model="fields.signupRepeatPassword">

            <div class="material-btn auth-window__body__accept" @click="signup()">Sign up</div>
        </div>

        <footer class="auth-window__footer">
            <h6>{{ l10n.orUseOtherAuthMethods }}</h6>

            <div class="auth-window__footer__services-buttons">
                <div @click="loginWithGoogle()" class="base-btn auth-window__footer__services-buttons__btn auth-window__footer__services-buttons--google">
                    <img src="/img/auth/google/btn_google_signin_dark_normal_web@2x.png" alt="Sign in with Google">
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
const cookie = process.client ? require('js-cookie') : undefined

export default {
    layout: 'auth',

    data() {
        return {
            l10n: this.$t('pages.auth.auth'),

            fields: {
                loginEmail: null,
                loginPassword: null,
                signupEmail: null,
                signupPassword: null,
                signupRepeatPassword: null,
            },
            login: true,
        }
    },

    methods: {
        loginWithGoogle() {},

        switchAuthType() {
            this.login = !this.login
        },

        async auth(method, params) {
            try {
                const {result: {userData}, token} = await this.$api.send({
                    app: 'auth',
                    method,
                    params,
                    v: 1,
                }, false)

                const authData = {
                    userData,
                    token,
                }

                await this.$i18n.setLocale(authData.userData.locale)

                this.$store.commit('auth/setAuth', authData)
                cookie.set('auth', authData)
                await this.$router.push('/')
            } catch (error) {
                console.log(`Error: ${error.stack}`)

                this.$toast.error(error.message, {
                    duration: 7500,
                })
            }
        },

        async loginLocal() {
            const params = {
                email: this.fields.loginEmail,
                password: this.fields.loginPassword,
            }
            await this.auth('login', params)
        },

        async signup() {
            const params = {
                email: this.fields.signupEmail,
                password: this.fields.signupPassword,
                repeatPassword: this.fields.signupRepeatPassword,
            }
            await this.auth('signup', params)
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/pages/auth/auth';
</style>
