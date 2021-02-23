<template>
    <div id="layout">
        <SimpleHeader/>

        <main id="page">
            <Nuxt/>
        </main>
    </div>
</template>

<script>
import SimpleHeader from '~/components/common/SimpleHeader.vue'

export default {
    components: {SimpleHeader}
}
</script>
