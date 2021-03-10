<template>
    <div id="page-plugin-idea">
        <Idea v-for="idea in ideas"/>
    </div>
</template>
<script>
import Idea from '~/components/idea/Idea'

export default {
    components: {Idea},

    data() {
        return {
            ideas: [],
        }
    },

    async fetch() {
    },
}
</script>
