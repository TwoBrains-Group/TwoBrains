<template>
    <div class="main-menu" :class="show ? 'show' : ''" ref="main-menu">
        <nuxt-link to="/" class="btn main-menu__btn" href="/">
            Home
        </nuxt-link>
        <hr>
<!--        <a class="btn main-menu__btn" href="/">-->
<!--            Profile-->
<!--        </a>-->

        <div class="main-menu__bottom">
            <nuxt-link to="/info/about" class="material-btn anti main-menu__bottom__about">
                About
            </nuxt-link>
            <h6 class="main-menu__bottom__copyright">
                <i class="far fa-copyright"></i> TwoBrains 2021
            </h6>
        </div>
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
