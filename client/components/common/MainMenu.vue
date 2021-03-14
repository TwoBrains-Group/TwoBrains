<template>
    <div class="main-menu" :class="show ? 'show' : ''" ref="main-menu">
        <nuxt-link to="/" class="btn main-menu__btn">
            {{ l10n.home }}
        </nuxt-link>

        <hr>

        <nuxt-link to="/idea" class="btn main-menu__btn">
            {{ l10n.ideas }}
        </nuxt-link>

        <nuxt-link to="/project" class="btn main-menu__btn">
            {{ l10n.projects }}
        </nuxt-link>

        <div class="main-menu__bottom">
            <nuxt-link to="/info/about" class="material-btn anti main-menu__bottom__about">
                {{ l10n.about }}
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
            l10n: this.$t('cmp.*.MainMenu'),
        }
    },

    computed: {
        show() {
            return this.$store.state.common.showMainMenu
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/common/MainMenu';
</style>
