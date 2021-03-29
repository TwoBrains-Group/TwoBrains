<template>
    <header id="main-header">
        <div class="main-header__back"></div>

        <div class="btn main-header__menu-btn" @click="toggleMainMenu()">
            <i class="fas fa-bars"></i>
        </div>

        <nuxt-link to="/" class="main-header__logo btn">
            <span class="logo-text">
                <span class="T">T</span><span>wo</span><span class="B">B</span><span>rains</span>
            </span>
<!--            <img class="main-header__logo__img" src="~static/img/TwoBrains.svg" alt="TwoBrains">-->
        </nuxt-link>

        <client-only>
            <div class="right">
                <div class="main-header__search"
                     :class="{open: showSearch}">
                    <Input type="text"
                           class="main-header__search__input"
                           ref="search"
                           :placeholder="l10n.search"
                           :enter="search"/>

                    <div class="btn main-header__search__btn" @click="toggleSearch">
                        <i class="fas fa-search"></i>
                    </div>

                    <div class="sb sb--small main-header__search__results" v-if="showSearch">
                        <span class="main-header__search__results__no-result" v-if="noSearchResult">
                            {{ l10n.noSearchResult }}
                        </span>

                        <section class="main-header__search__results__section users"
                                 v-if="Object.keys(searchResults.users).length">
                            <div class="main-header__search__results__section__name">{{ l10n.users }}</div>

                            <nuxt-link :to="userUrl(user)"
                                       class="btn main-header__search__results__section__el main-header__search__results__section__el--user"
                                       v-for="user of searchResults.users"
                                       :key="user.uid">
                                <div class="avatar">
                                    <img :src="user.avatar" alt="avatar">
                                </div>
                                <span class="nickname">
                                    {{ user.nickname }}
                                </span>
                            </nuxt-link>
                        </section>

                        <section class="main-header__search__results__section ideas"
                                 v-if="Object.keys(searchResults.ideas).length">
                            <div class="main-header__search__results__section__name">{{ l10n.ideas }}</div>

                            <nuxt-link :to="ideaUrl(idea)"
                                       class="btn main-header__search__results__section__el main-header__search__results__section__el--idea"
                                       v-for="idea of searchResults.ideas"
                                       :key="idea.id">
                                <span class="preview">
                                    {{ idea.name }}
                                </span>
                            </nuxt-link>
                        </section>
                    </div>
                </div>

                <div class="btn main-header__plus" @click="togglePlusMenu">
                    <i class="fas fa-plus"></i>
                </div>

                <div class="main-header__user-btn btn" @click="toggleUserMenu">
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
            <nuxt-link to="/project/create" class="btn main-header__plus-menu__btn">Create project</nuxt-link>
        </div>

        <div class="main-header__user-menu" :class="{show: showUserMenu}">
            <nuxt-link to="/profile" class="btn main-header__user-menu__btn">{{ l10n.profile }}</nuxt-link>
            <nuxt-link to="/user/settings" class="btn main-header__user-menu__btn">{{ l10n.settings }}</nuxt-link>

            <hr>

            <div class="btn main-header__user-menu__btn main-header__user-menu__btn--log-out" @click="logout">
                {{ l10n.logout }}
            </div>
        </div>
    </header>
</template>

<style lang="scss">
@import '~assets/sass/components/common/Header';
</style>

<script>
import Input from '@/components/ui/Input'
import {mapGetters, mapMutations} from 'vuex'

const cookie = process.client ? require('js-cookie') : undefined

export default {
    name: 'Header',

    components: {
        Input,
    },

    data() {
        return {
            l10n: this.$t('cmp.*.Header'),

            showUserMenu: false,
            showPlusMenu: false,
            showSearch: false,

            searchResults: {
                users: {},
                ideas: {},
            },
            noSearchResult: true,
        }
    },

    watch: {
        $route() {
            this.showUserMenu = false
            this.showPlusMenu = false
            this.showSearch = false
        },
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

        toggleSearch() {
            this.showPlusMenu = false
            this.showUserMenu = false
            this.showSearch = !this.showSearch
            if (this.showSearch) {
                this.$refs.search.focus()
            } else {
                this.searchResults = {
                    users: {},
                    ideas: {},
                }
            }
        },

        togglePlusMenu() {
            this.showSearch = false
            this.showUserMenu = false
            this.showPlusMenu = !this.showPlusMenu
        },

        toggleUserMenu() {
            this.showSearch = false
            this.showPlusMenu = false
            this.showUserMenu = !this.showUserMenu
        },

        closeSearch() {
            this.showSearch = false
            this.searchResults = {
                users: {},
                ideas: {},
            }
        },

        userUrl(user) {
            return `/user/${user.uid}`
        },

        ideaUrl(idea) {
            return `/idea/${idea.id}`
        },

        async search(value) {
            if (!value.length) {
                return
            }

            try {
                const params = {
                    text: value,
                }

                const searchResults = await this.$api.send({
                    app: 'search',
                    method: 'simple',
                    params,
                    v: 1,
                })

                this.noSearchResult = !Object.keys(searchResults.ideas).length &&
                                      !Object.keys(searchResults.users).length

                this.searchResults = searchResults
            } catch (error) {
                this.$toast.error('Failed to search')
            }
        },
    },
}
</script>
