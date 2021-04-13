<template>
    <div class="MainMenu" :class="show ? 'show' : ''" ref="MainMenu">
        <nuxt-link to="/" class="btn MainMenu_btn">
            {{ l10n.home }}
        </nuxt-link>

        <hr>

        <nuxt-link to="/idea" class="btn MainMenu_btn">
            {{ l10n.ideas }}
        </nuxt-link>

        <nuxt-link to="/project" class="btn MainMenu_btn">
            {{ l10n.projects }}
        </nuxt-link>

        <div class="MainMenu_bottom">
            <nuxt-link to="/info/about" class="ui-materialBtn anti MainMenu_bottom_about">
                {{ l10n.about }}
            </nuxt-link>
            <h6 class="MainMenu_bottom_copyright">
                <i class="far fa-copyright"></i> TwoBrains 2021
            </h6>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/common/MainMenu';
</style>

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
