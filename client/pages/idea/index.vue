<template>
    <div class="page-idea">
        <IdeaList/>
    </div>
</template>

<style lang="scss" scoped>
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
