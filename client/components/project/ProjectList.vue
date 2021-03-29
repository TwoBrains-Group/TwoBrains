<template>
    <div class="project-list">
        <Project v-for="project in projects"
                 v-bind="project"
                 :key="project.id"/>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/project/ProjectList';
</style>

<script>
import Project from '@/components/project/Project'
import Spinner from '@/components/ui/Spinner'

export default {
    name: 'ProjectList',

    components: {
        Project,
        Spinner,
    },

    props: {
        userUid: {
            type: String,
        },
    },

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
                userUid: this.userUid,
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
