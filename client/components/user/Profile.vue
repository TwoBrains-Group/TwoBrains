<template>
    <div class="user-Profile">
        <aside class="user-Profile_aside">
            <div class="user-Profile_aside_avatar">
                <nuxt-link :to="'/user/' + user.uid">
                    <img :src="user.avatar" alt="avatar">
                </nuxt-link>
                <!--        <div class="user-Profile_aside_avatar_online"></div>-->
            </div>

            <div class="user-Profile_aside_nickname">
                <span>{{ user.nickname }}</span>

<!--                        <div class="user-Profile_aside_nickname_wasOnline">{{page.user.wasOnline}}</div>-->
            </div>

            <hr>

            <div class="user-Profile_aside_btns">
                <nuxt-link v-if="user.isMe"
                           to="/user/settings"
                           class="flat-btn user-Profile_aside_btns_el">{{ l10n.settings }}
                </nuxt-link>

                <div class="user-Profile_aside_btns_el _followingYou"
                     v-if="!user.isMe && (user.followingStatus === 'following_you' || user.followingStatus === 'mutual_following')">
                    - {{l10n[user.followingStatus] }} -
                </div>

                <div v-if="!user.isMe"
                     @click="follow"
                     class="flat-btn user-Profile_aside_btns_el">
                    <span>{{l10n[user.followingAction]}}</span>
                </div>

                <nuxt-link :to="'/user/' + user.uid + '/ideas'"
                           class="flat-btn user-Profile_aside_btns_el">{{ l10n.ideas }}
                </nuxt-link>

                <nuxt-link :to="'/user/' + user.uid + '/projects'"
                           class="flat-btn user-Profile_aside_btns_el">{{ l10n.projects }}
                </nuxt-link>
            </div>
        </aside>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/user/Profile';
</style>

<script>
export default {
    name: 'Profile',

    components: {},

    data() {
        return {
            l10n: this.$t('page.user._uid'),

            user: {},
        }
    },

    async fetch() {
        const params = {
            uid: this.$route.params.uid,
        }

        try {
            const {user} = await this.$api.send({
                app: 'user',
                method: 'getByUid',
                params,
                v: 1,
            })

            this.user = user
        } catch (error) {
            this.$toast.error('Failed to load user')
        }
    },

    methods: {
        async follow() {
            try {
                const params = {
                    id: this.user.id.toString(),
                }

                const {info} = await this.$api.send({
                    app: 'user',
                    method: 'follow',
                    params,
                    v: 1,
                })

                this.user = {
                    ...this.user,
                    ...info,
                }
            } catch (error) {
                this.$toast.error('Failed to follow user')
            }
        },
    },
}
</script>
