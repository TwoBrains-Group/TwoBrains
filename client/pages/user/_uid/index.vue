<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else class="user-profile">
        <header class="user-profile__header">
            <div class="user-profile__header__avatar">
                <img :src="user.avatar" alt="avatar">
                <!--        <div class="user-profile__header__avatar__online"></div>-->
            </div>
            <div class="user-profile__header__nickname">
                <span>{{user.nickname}}</span>

                <!--        <div class="user-profile__header__nickname__was-online">{{page.user.wasOnline}}</div>-->
            </div>
        </header>

        <nuxt-link :to="'/user/' + user.uid + '/ideas'">Ideas</nuxt-link>
    </div>
</template>

<script>
import Spinner from "@/components/common/Spinner";

export default {
    components: {Spinner},
    fetchOnServer: false,
    fetchKey: 'profile',

    data() {
        return {
            user: {}
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
}
</script>

<style lang="scss">
@import '~assets/sass/apps/user/profile.scss';
</style>
