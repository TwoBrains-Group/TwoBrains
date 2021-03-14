<template>
    <div class="user-ideas">
        <div class="user-ideas__list">
            <Idea v-for="idea in ideas" v-bind="idea"/>

            <InfiniteScroll :no-result="false" :no-more="false" @fetch="infiniteScroll"/>
        </div>
    </div>
</template>

<script>
import Idea from '@/components/idea/Idea'
import Spinner from '@/components/ui/Spinner'
import InfiniteScroll from '@/components/tools/InfiniteScroll'

export default {
    components: {
        InfiniteScroll,
        Spinner,
        Idea,
    },

    data() {
        return {
            batch: 25,
            offset: 0,
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
                uid: this.$route.params.uid,
                offset: this.offset,
                limit: this.batch,
            }

            try {
                const {ideas} = await this.$api.send({
                    app: 'idea',
                    method: 'getUserIdeas',
                    params,
                    v: 1,
                })

                this.ideas.push(...ideas)

                return ideas.length
            } catch (error) {
                this.$toast.error('Failed to load user ideas')
            }
        },
    },

    async fetch() {
    },
}
</script>

<style lang="scss">
@import '~assets/sass/pages/user/ideas.scss';
</style>
