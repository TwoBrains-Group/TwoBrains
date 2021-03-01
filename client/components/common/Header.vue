<template>
    <header class="main-header">
        <div class="main-header__back"></div>

        <div class="main-header__menu-btn btn" @click="toggleMainMenu()">
            <i class="fas fa-bars"></i>
        </div>

        <nuxt-link to="/" class="main-header__logo btn">
            <img class="main-header__logo__img" src="~static/img/logo.png" alt="TwoBrains">
        </nuxt-link>

        <div class="main-header__user-btn btn" @click="toggleUserMenu()">
            <div class="main-header__user-btn__avatar">
                <img :src="loggedInUser.avatar" alt="avatar">
            </div>
            <div class="main-header__user-btn__nickname">
                {{loggedInUser.nickname}}
            </div>
        </div>

        <div class="main-header__user-menu" :class="showUserMenu ? 'show' : ''">
            <nuxt-link to="/profile" class="btn main-header__user-menu__btn">Profile</nuxt-link>
            <nuxt-link to="/user/settings" class="btn main-header__user-menu__btn">Settings</nuxt-link>
            <hr>
            <div class="btn main-header__user-menu__btn main-header__user-menu__btn--log-out" @click="logout()">Log out</div>
        </div>
    </header>
</template>

<script>
const cookie = process.client ? require('js-cookie') : undefined
import {mapMutations, mapGetters} from 'vuex'

export default {
    data() {
        return {
            showUserMenu: false
        }
    },

    computed: {
        ...mapGetters('auth', [
            'loggedInUser',
        ])
    },

    methods: {
        ...mapMutations({
            toggleMainMenu: 'common/toggleMainMenu',
        }),

        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu
        },

        async logout() {
            cookie.remove('auth')
            this.$store.commit('auth/setAuth', null)
            await this.$router.push('/auth')
        },
    }
}
</script>

<style>
@import 'assets/sass/components/common/_header.scss';
</style>
