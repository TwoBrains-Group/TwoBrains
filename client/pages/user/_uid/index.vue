<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else class="user-profile">
        <aside class="user-profile__aside">
            <div class="user-profile__aside__avatar">
                <img :src="user.avatar" alt="avatar">
                <!--        <div class="user-profile__aside__avatar__online"></div>-->
            </div>

            <div class="user-profile__aside__nickname">
                <span>{{ user.nickname }}</span>

                <!--        <div class="user-profile__aside__nickname__was-online">{{page.user.wasOnline}}</div>-->
            </div>

            <hr>

            <div class="user-profile__aside__btns">
                <nuxt-link v-if="user.isMe"
                           to="/user/settings"
                           class="flat-btn user-profile__aside__btns__el">{{ l10n.settings }}
                </nuxt-link>

                <div class="user-profile__aside__btns__el user-profile__aside__btns__el--following-you"
                     v-if="!user.isMe && (user.followingStatus === 'following_you' || user.followingStatus === 'mutual_following')">
                    - {{l10n[user.followingStatus] }} -
                </div>

                <div v-if="!user.isMe"
                     @click="follow"
                     class="flat-btn user-profile__aside__btns__el">
                    <span>{{l10n[user.followingAction]}}</span>
                </div>

                <nuxt-link :to="'/user/' + user.uid + '/ideas'"
                           class="flat-btn user-profile__aside__btns__el">{{ l10n.ideas }}
                </nuxt-link>
            </div>
        </aside>

    </div>
</template>

<script>
import Spinner from '@/components/ui/Spinner'

export default {
    name: 'profile',

    components: {
        Spinner,
    },

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
                    id: this.user.id,
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

<style lang="scss">
@import '~assets/sass/pages/user/profile.scss';
</style>
