<template>
    <div class="idea-list">
        <Idea v-for="idea in ideas" :key="idea.id" v-bind="idea"/>

        <InfiniteScroll :no-result="l10n.noResult" :no-more="l10n.noMore" @fetch="infiniteScroll"/>
    </div>
</template>

<script>
import InfiniteScroll from '@/components/tools/InfiniteScroll'
import {ideaFetching} from '@/constants/fetching'
import Idea from '@/components/idea/Idea'

const ideasRelations = ['project', 'user']

export default {
    name: 'IdeaList',

    components: {
        Idea,
        InfiniteScroll,
    },

    props: {
        relation: {
            type: String,
            default: 'user',
            validator(value) {
                return ideasRelations.includes(value)
            },
        },
        userUid: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            l10n: this.$t('cmp.idea.IdeaList'),

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
                    limit: ideaFetching.limit,
                    offset: this.offset,
                    relation: this.relation,
                    userUid: this.userUid,
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
                this.$toast.error(this.l10n.failedToLoadIdeas)
            }
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/IdeaList';
</style>
