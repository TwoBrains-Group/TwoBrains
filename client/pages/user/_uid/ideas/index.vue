<template>
    <div class="user-ideas">
        <IdeaList :user-uid="uid" relation="user"/>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/user/ideas.scss';
</style>

<script>
import IdeaList from '@/components/idea/IdeaList'

export default {
    components: {
        IdeaList,
    },

    data() {
        return {
            uid: this.$route.params.uid,
            batch: 25,
            offset: 0,
            ideas: [],
        }
    },
}
</script>
