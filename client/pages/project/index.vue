<template>
    <div id="page-project">
        <ProjectList/>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/project/list';
</style>

<script>
import ProjectList from '@/components/project/ProjectList'

export default {
    name: 'page-project',
    components: {
        ProjectList,
    },
}
</script>
