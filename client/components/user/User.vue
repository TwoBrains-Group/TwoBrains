<template>
    <div class="user-User">
        <div class="user-User_avatar">
            <img :src="avatar">
        </div>
        <div class="user-User_nickname">
            <span>{{ nickname }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
