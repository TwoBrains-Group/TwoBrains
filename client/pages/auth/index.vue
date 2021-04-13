<template>
    <div class="page-auth">
        <header class="base-btn page-auth_header"
                @click="switchAuthType()">
            <h3 class="page-auth_header_h">
                {{ login ? l10n.login : l10n.signup }}
            </h3>
            <h6 class="page-auth_header_h _other">
                {{ login ? l10n.signup : l10n.login }}
            </h6>
        </header>

        <div class="page-auth_body _login" v-if="login">
            <Input type="email"
                   placeholder="email"
                   v-model="fields.loginEmail"
                   :min-len="3"
                   :max-len="320"
                   ref="loginEmail"
                   :regexp="emailPattern"
                   :regexp-err-msg="l10n.invalidEmailMessage"
                   :regexp-warn="true"/>

            <Input type="password"
                   :placeholder="l10n.password"
                   v-model="fields.loginPassword"
                   :min-len="8"
                   :max-len="64"
                   ref="loginPassword"/>

            <div class="ui-materialBtn page-auth_body_accept" @click="loginLocal()">{{ l10n.loginApply }}</div>
        </div>

        <div class="page-auth_body _signup" v-if="!login">
            <Input type="email"
                   placeholder="email"
                   v-model="fields.signupEmail"
                   :min-len="3"
                   :max-len="320"
                   ref="signupEmail"
                   :regexp="emailPattern"
                   :regexp-err-msg="l10n.invalidEmailMessage"
                   :regexp-warn="true"/>

            <Input type="password"
                   :placeholder="l10n.password"
                   v-model="fields.signupPassword"
                   :min-len="8"
                   :max-len="64"
                   ref="signupPassword"
                   :regexp="passwordPattern"
                   :regexp-err-msg="l10n.invalidPasswordMessage"
                   :regexp-warn="true"/>

            <Input type="password"
                   :placeholder="l10n.repeatPassword"
                   v-model="fields.signupRepeatPassword"
                   :min-len="8"
                   :max-len="64"
                   ref="signupRepeatPassword"/>

            <div class="ui-materialBtn page-auth_body_accept" @click="signup()">{{ l10n.signupApply }}</div>
        </div>

        <footer class="page-auth_footer">
            <h6>{{ l10n.orUseOtherAuthMethods }}</h6>

            <div class="page-auth_footer_servicesButtons">
                <div @click="loginWithGoogle()"
                     class="base-btn page-auth_footer_servicesButtons _google">
                    <img src="/img/auth/google/btn_google_signin_light_normal_web@2x.png" alt="Sign in with Google">
                </div>
            </div>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/pages/auth/auth';
</style>

<script>
import Input from '@/components/ui/Input'
import {emailPattern, passwordPattern} from '@/constants/patterns'

const cookie = process.client ? require('js-cookie') : undefined

export default {
    layout: 'auth',

    components: {
        Input,
    },

    data() {
        return {
            l10n: this.$t('page.auth.auth'),

            fields: {
                loginEmail: null,
                loginPassword: null,
                signupEmail: null,
                signupPassword: null,
                signupRepeatPassword: null,
            },
            login: true,

            emailPattern,
            passwordPattern,
        }
    },

    methods: {
        loginWithGoogle() {
        },

        switchAuthType() {
            this.login = !this.login
        },

        async auth(method, params) {
            try {
                const {
                    result: {userData},
                    token,
                } = await this.$api.send({
                    app: 'auth',
                    method,
                    params,
                    v: 1,
                }, false)

                const authData = {
                    userData,
                    token,
                }

                this.$store.commit('auth/setAuth', authData)
                cookie.set('auth', authData)
                await this.$i18n.setLocale(userData.locale)

                await this.$router.push('/')
            } catch (error) {
                this.$toast.error(error.message, {
                    duration: 7500,
                })
            }
        },

        async loginLocal() {
            if (!this.$refs.loginEmail.test() ||
                !this.$refs.loginPassword.test()) {
                return
            }

            const params = {
                email: this.fields.loginEmail,
                password: this.fields.loginPassword,
            }
            await this.auth('login', params)
        },

        async signup() {
            if (!this.$refs.signupEmail.test() ||
                !this.$refs.signupPassword.test() ||
                !this.$refs.signupRepeatPassword.test()) {
                return
            }

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
