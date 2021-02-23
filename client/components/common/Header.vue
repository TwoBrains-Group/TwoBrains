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
                <img src="~static/img/avatar.png" alt="avatar">
            </div>
            <div class="main-header__user-btn__nickname">
                mr.kek
            </div>
        </div>

        <div class="main-header__user-menu" :class="showUserMenu ? 'show' : ''">
            <nuxt-link to="/profile" class="btn main-header__user-menu__btn">Profile</nuxt-link>
            <div class="btn main-header__user-menu__btn">Settings</div>
            <hr>
            <div class="btn main-header__user-menu__btn main-header__user-menu__btn--log-out">Log out</div>
        </div>
    </header>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
    data() {
        return {
            showUserMenu: false
        }
    },
    methods: {
        ...mapMutations({
            toggleMainMenu: 'common.js/toggleMainMenu'
        }),
        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu
        }
    }
}
</script>

<style>
@import 'assets/sass/common/_header.scss';
</style>
