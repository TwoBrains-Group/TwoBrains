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
                     v-for="plugin in project.plugins"
                     :key="plugin.id"
                     @click="goto('ideas')">{{ l10n.pluginsNames[plugin.name] }}
                </div>
            </div>
        </header>

        <div class="project__body">
            <div class="project__body__section project__body__section--ideas" v-if="section === 'ideas'">
                <Idea v-for="idea in ideas" :key="idea.id" v-bind="idea"/>
            </div>

            <div class="project__body__section project__body__section--main" v-else>
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

<script>
import Spinner from '@/components/ui/Spinner'
import {ideasFetching} from '@/constants/fetching'
import Idea from '~/pages/project/_uid/plugin/idea'

export default {
    name: 'project',

    components: {Idea, Spinner},

    fetchKey: 'project',
    fetchOnServer: false,

    created() {
        if (process.client) {
            this.$l10n.page(this)
        }
    },

    data() {
        return {
            app: 'project',
            ideasOffset: 0,
            project: {},
            section: 'main',
            ideas: [],
            l10n: {
                description: 'Description',
                pluginsNames: [],
            },
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
                    ...ideasFetching,
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

<style lang="scss">
@import '~assets/sass/pages/project/single';
</style>
