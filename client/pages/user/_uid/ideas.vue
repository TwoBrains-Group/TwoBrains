<template>
    <div class="user-ideas">
        <Spinner v-if="$fetchState.pending"/>
        <div v-else class="user-ideas__list">
            <Idea v-for="idea in ideas" v-bind="idea"/>
        </div>
    </div>
</template>

<script>
import Idea from '@/components/idea/Idea'
import Spinner from "@/components/common/Spinner";

export default {
    fetchOnServer: false,
    fetchKey: 'user-ideas',
    components: {Spinner, Idea},

    data() {
        return {
            ideas: [],
        }
    },

    async fetch() {
        const params = {}

        try {
            const {ideas} = await this.$api.send({
                app: 'idea',
                method: 'getList',
                params,
                v: 1,
            })

            console.log(`Ideas: ${JSON.stringify(ideas, null, 2)}`)

            this.ideas = ideas
        } catch (error) {
            this.$toast.error(error.message)
        }
    }
}
</script>

<style lang="scss">
@import '~assets/sass/apps/user/ideas.scss';
</style>
