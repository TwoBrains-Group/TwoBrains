<template>
    <header id="main-header">
        <div class="main-header__back"></div>

        <div class="btn main-header__menu-btn" @click="toggleMainMenu()">
            <i class="fas fa-bars"></i>
        </div>

        <nuxt-link to="/" class="main-header__logo btn">
            <img class="main-header__logo__img" src="~static/img/logo.png" alt="TwoBrains">
        </nuxt-link>

        <client-only>
            <div class="right">
                <div class="btn main-header__plus" @click="showPlusMenu = !showPlusMenu">
                    <i class="fas fa-plus"></i>
                </div>

                <div class="main-header__user-btn btn" @click="showUserMenu = !showUserMenu">
                    <div class="main-header__user-btn__avatar">
                        <img :src="loggedInUser.avatar" alt="avatar">
                    </div>
                    <div class="main-header__user-btn__nickname">
                        {{ loggedInUser.nickname }}
                    </div>
                </div>
            </div>
        </client-only>

        <div class="main-header__plus-menu" :class="{show: showPlusMenu}">
            <nuxt-link to="/idea/create" class="btn main-header__plus-menu__btn">Create idea</nuxt-link>
            <nuxt-link to="/project/new" class="btn main-header__plus-menu__btn">Create project</nuxt-link>
        </div>

        <div class="main-header__user-menu" :class="{show: showUserMenu}">
            <nuxt-link to="/profile" class="btn main-header__user-menu__btn">{{ l10n.profile }}</nuxt-link>
            <nuxt-link to="/user/settings" class="btn main-header__user-menu__btn">{{ l10n.settings }}</nuxt-link>

            <hr>

            <div class="btn main-header__user-menu__btn main-header__user-menu__btn--log-out" @click="logout()">
                {{ l10n.logout }}
            </div>
        </div>
    </header>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'

const cookie = process.client ? require('js-cookie') : undefined

export default {
    name: 'Header',

    data() {
        return {
            l10n: this.$t('cmp.*.Header'),

            showUserMenu: false,
            showPlusMenu: false,
        }
    },

    computed: {
        ...mapGetters('auth', [
            'loggedInUser',
        ]),
    },

    methods: {
        ...mapMutations({
            toggleMainMenu: 'common/toggleMainMenu',
        }),

        async logout() {
            cookie.remove('auth')
            this.$store.commit('auth/setAuth', null)
            await this.$router.push('/auth')
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/common/Header';
</style>
