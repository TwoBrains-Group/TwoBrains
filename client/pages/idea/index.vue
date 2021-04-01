<template>
    <div id="page-idea">
        <IdeaList/>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/idea/index';
</style>

<script>
import IdeaList from '@/components/idea/IdeaList'

export default {
    name: 'ideas',

    components: {
        IdeaList,
    },
}
</script>
