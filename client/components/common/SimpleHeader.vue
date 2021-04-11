<template>
    <header id="main-header">
        <div class="main-header__back"></div>

        <nuxt-link to="/" class="main-header__logo btn">
            <LogoText/>
        </nuxt-link>

    </header>
</template>

<script>
import LogoText from "@/components/common/LogoText";
export default {
    name: 'SimpleHeader',
    components: {LogoText},
}
</script>
