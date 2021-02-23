<template>
    <div class="main-menu" :class="show ? 'show' : ''" ref="main-menu">
        <nuxt-link to="/" class="btn main-menu__btn" href="/">
            Home
        </nuxt-link>
        <hr>
<!--        <a class="btn main-menu__btn" href="/">-->
<!--            Profile-->
<!--        </a>-->
    </div>
</template>

<script>
export default {
    name: 'MainMenu',
    data() {
        return {
        }
    },

    computed: {
        show() {
            return this.$store.state.common.showMainMenu
        }
    }
}
</script>
