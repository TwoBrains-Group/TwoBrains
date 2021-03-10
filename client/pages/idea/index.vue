<template>
    <div class="ideas">
        <div class="user-ideas__list">
            <Idea v-for="idea in ideas" v-bind="idea" :key="idea.id"/>
        </div>

        <InfiniteScroll :no-result="false" :no-more="false" @fetch="infiniteScroll"/>
    </div>
</template>

<script>
import Idea from '@/components/idea/Idea'
import Spinner from '@/components/ui/Spinner'
import InfiniteScroll from '@/components/tools/InfiniteScroll'

export default {
    fetchOnServer: false,
    fetchKey: 'user-ideas',
    components: {Spinner, Idea, InfiniteScroll},

    data() {
        return {
            offset: 0,
            batch: 25,
            ideas: [],
        }
    },

    methods: {
        async infiniteScroll($state) {
            const count = await this.fetchIdeas()
            if (count > 0) {
                $state.loaded()
                this.offset += this.batch
            } else {
                $state.complete()
            }
        },

        async fetchIdeas() {
            const params = {
                offset: this.offset,
                limit: this.batch,
            }

            try {
                const {ideas} = await this.$api.send({
                    app: 'idea',
                    method: 'getList',
                    params,
                    v: 1,
                })

                this.ideas.push(...ideas)

                return ideas.length
            } catch (error) {
                this.$toast.error('Failed to load ideas')
            }
        },
    },

    async fetch() {
        // await this.fetchIdeas()
    },
}
</script>

<style lang="scss">
@import '~assets/sass/pages/idea/index';
</style>

