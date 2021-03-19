<template>
    <Spinner v-if="$fetchState.pending"/>
    <div v-else id="page-project-uid">
        <header class="project__header">
            <div class="project__header__image">
                <img :src="project.image" alt="project image">
            </div>

            <div class="project__header__name">
                {{ project.name }}
            </div>

            <div class="project__header__plugins" v-if="project.plugins.length">
                <div class="btn project__header__plugins__el"
                     v-for="plugin in [{name: 'home'}, ...project.plugins]"
                     :key="plugin.id"
                     @click="goto(plugin.name)">{{ l10n.sections[plugin.name] }}
                </div>
            </div>
        </header>

        <div class="project__body">
            <div class="project__body__section project__body__section--ideas" v-if="section === 'idea'">
                <IdeaList relation="user"/>
            </div>

            <div class="project__body__section project__body__section--main" v-else-if="!section.length || section === 'home'">
                <div class="project__body__section--main__descr">
                    <h3 class="project__body__section--main__descr__h">{{ l10n.description }}</h3>
                    <p class="project__body__section--main__descr__p">
                        {{ project.description }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/project/single';
</style>

<script>
import Spinner from '@/components/ui/Spinner'
import {ideaFetching} from '@/constants/fetching'
import IdeaList from '@/components/idea/IdeaList'

export default {
    name: 'project',

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
        }
    },

    async fetch() {
        const params = {
            uid: this.$route.params.uid,
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
    },
}
</script>
