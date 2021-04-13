<template>
    <Form class="page-project-create" @apply="done">
        <div class="page-project-create_wrapper">
            <h3 class="page-project-create_wrapper_header">{{ l10n.createProject }}</h3>

            <Input v-model="name"
                   class="page-project-create_wrapper_name"
                   :placeholder="l10n.nameYourProject"
                   ref="name"
                   :min-len="1" :max-len="128"/>

            <Textarea class="page-project-create_wrapper_description"
                      v-model="description"
                      :placeholder="l10n.description"
                      ref="description"
                      :min-len="1"
                      :max-len="5000"/>

            <ToggleSwitch :left-label="l10n.public"
                          :right-label="l10n.private"
                          @toggle="toggleVisibility"
                          outlined/>

            <div class="page-project-create_wrapper_plugins">
                <h6 class="page-project-create_wrapper_plugins_header"
                    @click="showPlugins = !showPlugins">
                    {{ l10n.addPlugins }}
                    <!--                    {{addedPluginsUids.size > 0 ? ':' : ''}}-->
                    <!--                    <span class="page-project-create_wrapper_plugins_header_addedPlugins" v-for="puid of addedPluginsUids">-->
                    <!--                        {{ $t(`entities.plugins.${puid}.name`) }}-->
                    <!--                    </span>-->
                    <i class="fas" :class="{'fa-plus': !showPlugins, 'fa-minus': showPlugins}"></i>
                </h6>

                <Debounce class="u-sb u-sb--small page-project-create_wrapper_plugins_list"
                          :class="{_show: showPlugins}">
                    <div class="page-project-create_wrapper_plugins_list_el"
                         v-for="plugin of plugins"
                         :class="{_active: addedPlugins.has(plugin.id)}"
                         @click="togglePlugin(plugin.id, plugin.uid)">
                        <span class="page-project-create_wrapper_plugins_list_el_name">
                            {{ $t(`entities.plugins.${plugin.uid}.name`) }}
                            <i class="fas fa-check"></i>
                        </span>

                        <p class="page-project-create_wrapper_plugins_list_el_description">
                            {{ $t(`entities.plugins.${plugin.uid}.shortDescription`) }}
                        </p>
                    </div>
                </Debounce>
            </div>

            <TagSearch ref="tagSearch" :header="l10n.addTags"/>
        </div>

        <Btn class="material-btn--flat page-project-create_done"
             @click.native="done"
             :disabled="doneDisabled">
            {{ l10n.done }}
        </Btn>
    </Form>
</template>

<style lang="scss" scoped>
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
import Form from '@/components/ui/Form'

export default {
    name: 'project-create',

    components: {
        Form,
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
            isPrivate: false,
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
                visibility: this.isPrivate ? 'private' : 'public',
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

        toggleVisibility(isPrivate) {
            this.isPrivate = isPrivate
        },
    },
}
</script>
