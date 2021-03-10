<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else id="page-project">
        <Project v-for="project in projects" v-bind="project" :key="project.id"/>
    </div>
</template>

<script>
import Project from '@/components/project/Project'
import Spinner from '@/components/ui/Spinner'

export default {
    components: {Project, Spinner},
    fetchOnServer: false,

    data() {
        return {
            projects: [],
            limit: 10,
            offset: 0,
        }
    },

    async fetch() {
        try {
            const params = {
                limit: this.limit,
                offset: this.offset,
            }

            const {projects} = await this.$api.send({
                app: 'project',
                method: 'getList',
                params,
                v: 1,
            })

            this.projects = projects
        } catch (error) {
            this.$toast.error('Failed to load projects')
        }
    },
}
</script>

<style lang="scss">
@import '~assets/sass/pages/project/list';
</style>
