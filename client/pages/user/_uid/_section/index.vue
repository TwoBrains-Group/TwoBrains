<template>
    <div class="page-userProfile">
        <Profile/>
        <div class="page-userProfile_wall">
            <ProjectList :user-uid="uid" v-if="section === 'projects'"/>
            <IdeaList :user-uid="uid" relation="user" v-if="section === 'ideas'"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/pages/user/profile';
</style>

<script>
import Profile from '@/components/user/Profile'
import ProjectList from '@/components/project/ProjectList'
import IdeaList from '@/components/idea/IdeaList'

export default {
    components: {
        IdeaList,
        ProjectList,
        Profile,
    },

    data() {
        return {
            section: this.$route.params.section,
            uid: this.$route.params.uid,
        }
    },
}
</script>
