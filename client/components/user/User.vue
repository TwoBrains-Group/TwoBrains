<template>
    <div class="user">
        <div class="user__avatar">
            <img :src="avatar">
        </div>
        <div class="user__nickname">
            <span>{{ nickname }}</span>
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/user/User';
</style>

<script>
export default {
    name: 'User',

    props: {
        nickname: {
            type: String,
        },
        avatar: {
            type: String,
        },
    },

    data() {
        return {}
    },
}
</script>
