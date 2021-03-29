<template>
    <div id="project-create">
        <div class="project-create__wrapper">
            <h3 class="project-create__header">{{ l10n.createProject }}</h3>

            <Input v-model="name"
                   class="project-create__wrapper__name"
                   :placeholder="l10n.nameYourProject"
                   ref="name"
                   :min-len="1" :max-len="128"/>

            <Textarea v-model="description"
                      :placeholder="l10n.description"
                      ref="description"
                      :min-len="1"
                      :max-len="5000"/>

            <ToggleSwitch :left-label="'private'" :right-label="l10n.public" outlined/>

            <div class="project-create__plugins">
                <h6 class="project-create__plugins__header" @click="showPlugins = !showPlugins">
                    Add plugins
<!--                    {{addedPluginsUids.size > 0 ? ':' : ''}}-->
<!--                    <span class="added-plugin" v-for="puid of addedPluginsUids">-->
<!--                        {{ $t(`entities.plugins.${puid}.name`) }}-->
<!--                    </span>-->
                    <i class="fas" :class="{'fa-plus': !showPlugins, 'fa-minus': showPlugins}"></i>
                </h6>

                <Debounce class="sb sb--small list" :class="{show: showPlugins}">
                    <div class="project-create__plugins__el"
                         v-for="plugin of plugins"
                         :class="{active: addedPlugins.has(plugin.id)}"
                         @click="togglePlugin(plugin.id, plugin.uid)">
                        <span class="project-create__plugins__el__name">
                            {{ $t(`entities.plugins.${plugin.uid}.name`) }}
                            <i class="fas fa-check"></i>
                        </span>

                        <p class="project-create__plugins__el__description">
                            {{ $t(`entities.plugins.${plugin.uid}.shortDescription`) }}
                        </p>
                    </div>
                </Debounce>
            </div>

            <TagSearch ref="tagSearch" :header="l10n.addTags"/>
        </div>

        <Btn class="material-btn material-btn--flat project-create__done"
             @click.native="done"
             :disabled="doneDisabled">
            {{ l10n.done }}
        </Btn>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/project/create';
</style>

<script>
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Checkbox from '@/components/ui/Checkbox'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import TagSearch from '@/components/tag/TagSearch'
import Debounce from '@/components/ui/Debounce'
import Btn from '@/components/ui/Btn'

export default {
    name: 'project-create',

    components: {
        Btn,
        Debounce,
        TagSearch,
        ToggleSwitch,
        Checkbox,
        Textarea,
        Input,
    },

    data() {
        return {
            l10n: {
                ...this.$t('page.project.create'),
            },

            name: '',
            description: '',
            addedPlugins: new Set(),
            addedPluginsUids: new Set(),
            plugins: [],
            showPlugins: false,
            doneDisabled: true,
        }
    },

    mounted() {
        this.$refs.name.$on('input', val => {
            this.doneDisabled = !this.$refs.name.test(false)
        })
    },

    async fetch() {
        try {
            const params = {}

            const {plugins} = await this.$api.send({
                app: 'plugin',
                method: 'getList',
                params,
                v: 1,
            })

            this.plugins = plugins
        } catch (error) {
            this.$toast.error('Failed to load plugins')
        }
    },

    methods: {
        async done() {
            const params = {
                name: this.name,
                description: this.description.length ? this.description : null,
                tags: [...this.$refs.tagSearch.addedTags].map(t => t.toString()),
                plugins: [...this.addedPlugins].map(p => p.toString()),
            }

            try {
                const {url} = await this.$api.send({
                    app: 'project',
                    method: 'create',
                    params,
                    v: 1,
                })

                await this.$router.push(url)
            } catch (error) {
                this.$toast.error('Failed to create project')
            }
        },

        togglePlugin(id, uid) {
            this.addedPlugins.has(id) ? this.addedPlugins.delete(id) : this.addedPlugins.add(id)
            this.addedPluginsUids.has(uid) ? this.addedPluginsUids.delete(uid) : this.addedPluginsUids.add(uid)
            this.$forceUpdate()
        },
    },
}
</script>
