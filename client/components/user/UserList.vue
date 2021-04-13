<template>
    <div class="user-UserList">
        <User v-for="user of users" v-bind="user" :key="user.id"/>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/user/UserList';
</style>

<script>
import User from '@/components/user/User'

export default {
    name: 'UserList',
    components: {
        User,
    },
    props: {
        users: {
            type: Array,
        },
    },

    data() {
        return {}
    },

    methods: {},
}
</script>
