<template>
    <div class="idea-list">
        <Idea v-for="idea in ideas" :key="idea.id" v-bind="idea"/>

        <InfiniteScroll :no-result="false" :no-more="false" @fetch="infiniteScroll"/>
    </div>
</template>

<script>
import InfiniteScroll from '@/components/tools/InfiniteScroll'
import {ideasFetching} from '@/constants/fetching'
import Idea from '@/components/idea/Idea'

const ideasRelations = ['project', 'user']

export default {
    components: {Idea, InfiniteScroll},
    fetchOnServer: false,

    props: {
        relation: {
            type: String,
            default: 'user',
            validator(value) {
                return ideasRelations.includes(value)
            },
        },
    },

    data() {
        return {
            ideas: [],
            offset: 0,
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
            try {
                const params = {
                    limit: ideasFetching.limit,
                    offset: this.offset,
                    relation: this.relation,
                }

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
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/IdeaList';
</style>
