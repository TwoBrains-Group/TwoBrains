<template>
    <header id="main-header">
        <div class="main-header__back"></div>

        <nuxt-link to="/" class="main-header__logo btn">
            <img class="main-header__logo__img" src="~static/img/logo.png" alt="TwoBrains">
        </nuxt-link>

    </header>
</template>

<script>
export default {
    name: 'SimpleHeader',
}
</script>
