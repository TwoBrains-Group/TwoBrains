<template>
    <header class="Header">
        <div class="Header_back"></div>

        <div class="btn Header_menuBtn" @click="toggleMainMenu()">
            <i class="fas fa-bars"></i>
        </div>

        <nuxt-link to="/" class="Header_logo btn">
            <LogoText class="Header_logo_LogoText"/>
<!--            <img class="Header_logo_img" src="~static/img/TwoBrains.svg" alt="TwoBrains">-->
        </nuxt-link>

        <client-only>
            <div class="u-right">
                <div class="Header_search" :class="{open: showSearch}">
                    <Input type="text"
                           class="Header_search_Input"
                           ref="search"
                           :placeholder="l10n.search"
                           :enter="search"/>

                    <div class="btn Header_search_searchBtn" @click="toggleSearch">
                        <i class="fas fa-search"></i>
                    </div>

                    <div class="u-sb u-sb--small Header_search_searchResults" v-if="showSearch">
                        <span class="Header_search_searchResults_noResult" v-if="noSearchResult">
                            {{ l10n.noSearchResult }}
                        </span>

                        <section class="Header_search_searchResults_section users"
                                 v-if="Object.keys(searchResults.users).length">
                            <div class="Header_search_searchResults_section_name">{{ l10n.users }}</div>

                            <nuxt-link :to="userUrl(user)"
                                       class="btn Header_search_searchResults_section_el _user"
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

                        <section class="Header_search_searchResults_section ideas"
                                 v-if="Object.keys(searchResults.ideas).length">
                            <div class="Header_search_searchResults_section_name">{{ l10n.ideas }}</div>

                            <nuxt-link :to="ideaUrl(idea)"
                                       class="btn Header_search_searchResults_section_el _idea"
                                       v-for="idea of searchResults.ideas"
                                       :key="idea.id">
                                <span class="preview">
                                    {{ idea.name }}
                                </span>
                            </nuxt-link>
                        </section>

                        <section class="Header_search_searchResults_section projects"
                                 v-if="Object.keys(searchResults.projects).length">
                            <div class="Header_search_searchResults_section_name">{{ l10n.projects }}</div>

                            <nuxt-link :to="projectUrl(project)"
                                       class="btn Header_search_searchResults_section_el _project"
                                       v-for="project of searchResults.projects"
                                       :key="project.id">
                                <span class="preview">
                                    {{ project.name }}
                                </span>
                            </nuxt-link>
                        </section>
                    </div>
                </div>

                <div class="btn Header_plusBtn" @click="togglePlusMenu">
                    <i class="fas fa-plus"></i>
                </div>

                <div class="btn Header_userBtn" @click="toggleUserMenu">
                    <div class="Header_userBtn_avatar">
                        <img :src="loggedInUser.avatar" alt="avatar">
                    </div>
                    <div class="Header_userBtn_nickname">
                        {{ loggedInUser.nickname }}
                    </div>
                </div>
            </div>
        </client-only>

        <div class="Header_plusMenu" :class="{show: showPlusMenu}">
            <nuxt-link to="/idea/create" class="btn Header_plusMenu_btn">Create idea</nuxt-link>
            <nuxt-link to="/project/create" class="btn Header_plusMenu_btn">Create project</nuxt-link>
        </div>

        <div class="Header_userMenu" :class="{show: showUserMenu}">
            <nuxt-link to="/profile" class="btn Header_userMenu_btn">{{ l10n.profile }}</nuxt-link>
            <nuxt-link to="/user/settings" class="btn Header_userMenu_btn">{{ l10n.settings }}</nuxt-link>

            <hr>

            <div class="btn Header_userMenu_btn _logOut" @click="logout">
                {{ l10n.logout }}
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/common/Header';
</style>

<script>
import Input from '@/components/ui/Input'
import {mapGetters, mapMutations} from 'vuex'
import LogoText from "@/components/common/LogoText";

const cookie = process.client ? require('js-cookie') : undefined

export default {
    name: 'Header',

    components: {
        LogoText,
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
                projects: {},
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
                    projects: {},
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

        projectUrl(project) {
            return `/user/${project.userUid}/project/${project.uid}`
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
                                      !Object.keys(searchResults.users).length &&
                                      !Object.keys(searchResults.projects).length

                this.searchResults = searchResults
            } catch (error) {
                this.$toast.error('Failed to search')
            }
        },
    },
}
</script>
