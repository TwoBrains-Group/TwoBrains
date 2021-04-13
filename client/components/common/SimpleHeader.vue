<template>
    <header id="Header">
        <div class="Header_back"></div>

        <nuxt-link to="/" class="Header_logo btn">
            <LogoText/>
        </nuxt-link>

    </header>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/common/Header';
</style>

<script>
import LogoText from "@/components/common/Header";

export default {
    name: 'SimpleHeader',
    components: {LogoText},
}
</script>
