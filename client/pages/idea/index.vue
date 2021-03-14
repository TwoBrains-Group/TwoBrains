<template>
    <div class="ideas">
        <div class="user-ideas__list">
            <Idea v-for="idea in ideas" v-bind="idea" :key="idea.id"/>
        </div>

        <InfiniteScroll :no-result="l10n.noIdeasHere + ' 😞'"
                        no-result-link-url="/idea/create"
                        :no-result-link-text="l10n.addOne"
                        :no-more="false"
                        @fetch="infiniteScroll"/>
    </div>
</template>

<script>
import Idea from '@/components/idea/Idea'
import Spinner from '@/components/ui/Spinner'
import InfiniteScroll from '@/components/tools/InfiniteScroll'

export default {
    name: 'index',

    components: {
        Spinner,
        Idea,
        InfiniteScroll,
    },

    data() {
        return {
            l10n: this.$t('page.idea.index'),

            offset: 0,
            limit: 25,
            ideas: [],
        }
    },

    methods: {
        async infiniteScroll($state) {
            const count = await this.fetchIdeas()
            if (count > 0) {
                $state.loaded()
                this.offset += count
            } else {
                $state.complete()
            }
        },

        async fetchIdeas() {
            const params = {
                offset: this.offset,
                limit: this.limit,
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

