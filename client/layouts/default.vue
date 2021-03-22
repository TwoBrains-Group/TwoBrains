<template>
    <div id="layout">
        <Header ref="header"/>
        <MainMenu/>

        <main id="page">
            <Nuxt/>
        </main>
    </div>
</template>

<style lang="scss">
@import 'assets/sass/common/common';
</style>

<script>
import Vue from 'vue'
import Header from '~/components/common/Header.vue'
import MainMenu from '~/components/common/MainMenu.vue'

const cookie = process.client ? require('js-cookie') : undefined

const userUpdateTimeDiff = 30 * 60 * 1000

export default Vue.extend({
    components: {
        MainMenu,
        Header,
    },

    middleware: ['auth'],

    mounted() {
        window.addEventListener('keyup', e => {
            if (e.key === 'Escape') {
                this.closeSearch()
            }
        })
    },

    methods: {
        closeSearch() {
            this.$refs.header.closeSearch()
        },
    },
})
</script>
