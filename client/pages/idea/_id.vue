<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else id="page-idea-_id">
        <Idea v-bind="idea" :is-page="true"/>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/idea/single';
</style>

<script>
import Idea from '@/components/idea/Idea'
import Spinner from '@/components/ui/Spinner'

export default {
    components: {
        Idea,
        Spinner,
    },

    data() {
        return {
            idea: null,
        }
    },

    async fetch() {
        const params = {
            id: this.$route.params.id,
        }

        try {
            const {idea} = await this.$api.send({
                app: 'idea',
                method: 'getById',
                params,
                v: 1,
            })

            this.idea = idea
        } catch (error) {
            this.$toast.error('Failed to load idea')
        }
    },
}
</script>
