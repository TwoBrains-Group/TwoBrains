<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else class="page-userProject">
        <header class="page-userProject_header">
            <div class="page-userProject_header_image">
                <img :src="project.image" alt="project image">
            </div>

            <div class="page-userProject_header_name">
                {{ project.name }}
            </div>

            <div class="page-userProject_header_btns">
                <div class="btn page-userProject_header_btns_el _star"
                     :class="{_liked: liked}"
                     @click="like">
                    <i class="fa-star" :class="liked ? 'fas' : 'far'"></i> <span>{{ likesCount }}</span>
                </div>
                <div class="btn page-userProject_header_btns_el _share">
                    <i class="fas fa-share-alt"></i>
                </div>
            </div>

            <div class="page-userProject_header_plugins" v-if="project.plugins.length">
                <div class="btn page-userProject_header_plugins_el"
                     v-for="plugin in [{name: 'home'}, ...project.plugins]"
                     :key="plugin.id"
                     @click="goto(plugin.name)">{{ l10n.sections[plugin.name] }}
                </div>
            </div>
        </header>

        <div class="page-userProject_body">
            <div class="page-userProject_body_section _ideas" v-if="section === 'idea'">
                <IdeaList relation="user"/>
            </div>

            <div class="page-userProject_body_section _main"
                 v-else-if="!section.length || section === 'home'">
                <div class="page-userProject_body_section_description">
                    <h3 class="page-userProject_body_section_description_h">{{ l10n.description }}</h3>
                    <p class="page-userProject_body_section_description_p">
                        {{ project.description }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/pages/project/single';
</style>

<script>
import Spinner from '@/components/ui/Spinner'
import {ideaFetching} from '@/constants/fetching'
import IdeaList from '@/components/idea/IdeaList'

export default {
    name: 'user-project',

    components: {
        IdeaList,
        Spinner,
    },

    data() {
        return {
            l10n: this.$t('page.project._uid'),

            ideasOffset: 0,
            project: {},
            section: 'home',
            ideas: [],
            liked: false,
            likesCount: 0,
        }
    },

    async fetch() {
        const params = {
            userUid: this.$route.params.uid,
            uid: this.$route.params.projectUid,
        }

        try {
            const {project} = await this.$api.send({
                app: 'project',
                method: 'getByUid',
                params,
                v: 1,
            })

            if (!project) {
                await this.$router.push('/error/404')
                return
            }

            this.project = project
            this.liked = project.liked
            this.likesCount = project.likesCount
        } catch (error) {
            this.$toast.error('Failed to load project')
        }
    },

    methods: {
        goto(sec) {
            this.section = sec
        },

        async fetchIdeas() {
            try {
                const params = {
                    ...ideaFetching,
                    offset: this.ideasOffset,
                }

                const {ideas} = await this.$api.send({
                    app: 'project',
                    method: 'getIdeas',
                    params,
                    v: 1,
                })

                this.ideas = ideas
            } catch (error) {
                this.$toast.error('Failed to load ideas')
            }
        },

        async like() {
            try {
                const params = {
                    id: this.project.id,
                }

                const {
                    liked,
                    likesCount,
                } = await this.$api.send({
                    app: 'project',
                    method: 'like',
                    params,
                    v: 1,
                })

                this.liked = liked
                this.likesCount = likesCount
            } catch (error) {
                this.$toast.error('Failed to like project')
            }
        },
    },
}
</script>
