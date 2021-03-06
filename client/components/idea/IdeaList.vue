<template>
    <div class="idea-IdeaList">
        <Idea v-for="idea in ideas" :key="idea.id" v-bind="idea"/>

        <InfiniteScroll :no-result="l10n.noIdeasHere + ' 😞'"
                        no-result-link-url="/idea/create"
                        :no-result-link-text="l10n.addOne"
                        @fetch="infiniteScroll"/>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/idea/IdeaList';
</style>

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
