<template>
    <div class="user-list">
        <User v-for="user of users" v-bind="user"/>
    </div>
</template>

<style lang="scss">
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
