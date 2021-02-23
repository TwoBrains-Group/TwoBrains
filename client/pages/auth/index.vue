<template>
    <div class="auth-window">
        <header class="base-btn auth-window__header" @click="switchAuthType()">
            <h3 class="auth-window__header_h auth-window__header_h--login" :class="login ? 'chosen' : ''">Login</h3>
            <h3 class="auth-window__header_h auth-window__header_h--signup" :class="!login ? 'chosen' : ''">Sign up</h3>
        </header>

        <div class="auth-window__body auth-window__body--login" v-if="login">
            <label for="auth-window-email--login">email</label>
            <input id="auth-window-email--login" type="email" placeholder="email" v-model="fields.loginEmail">

            <label for="auth-window-password--login">password</label>
            <input id="auth-window-password--login" type="password" placeholder="password" v-model="fields.loginPassword">

            <div class="material-btn auth-window__body__accept" @click="loginLocal()">Login</div>
        </div>

        <div class="auth-window__body auth-window__body--signup" v-if="!login">
            <label for="auth-window-email--signup">email</label>
            <input id="auth-window-email--signup" type="email" placeholder="email" v-model="fields.signupEmail">

            <label for="auth-window-password--signup">password</label>
            <input id="auth-window-password--signup" type="password" placeholder="password" v-model="fields.signupPassword">

            <label for="auth-window-password-repeat--signup">repeat password</label>
            <input id="auth-window-password-repeat--signup" type="password" placeholder="repeat password" v-model="fields.signupRepeatPassword">

            <div class="material-btn auth-window__body__accept" @click="signup()">Sign up</div>
        </div>

        <footer class="auth-window__footer">
            <h6>or use other auth methods:</h6>

            <div class="auth-window__footer__services-buttons">
                <div @click="loginWithGoogle()" class="base-btn auth-window__footer__services-buttons__btn auth-window__footer__services-buttons--google">
                    <img src="~static/img/auth/google/btn_google_signin_dark_normal_web@2x.png" alt="Sign in with Google">
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    layout: 'auth',

    asyncData({query, app}) {
        if (query.logging_in) {
            console.log('logging in')
        }
    },

    data() {
        return {
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
        loginWithGoogle() {
            // this.$auth.loginWith('google', { params: { prompt: 'consent' } })
        },

        switchAuthType() {
            this.login = !this.login
        },

        loginLocal() {
            const data = {
                email: this.fields.loginEmail,
                password: this.fields.loginPassword,
            }


        },

        signup() {

        },
    },
}
</script>

<style lang="scss">
@import '../../assets/sass/apps/auth/auth';
</style>
