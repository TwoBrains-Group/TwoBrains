<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else class="idea-container">
        <Idea v-bind="idea" :is-page="true"/>
    </div>
</template>

<script>
import Idea from "@/components/idea/Idea";
import Spinner from "@/components/common/Spinner";

export default {
    components: {Idea, Spinner},
    fetchOnServer: false,
    fetchKey: 'idea',

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
            this.$toast.error(`Failed to load idea`)
        }
    }
}
</script>

<style lang="scss">
@import '~assets/sass/apps/idea/single.scss';
</style>
