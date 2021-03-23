<template>
    <div id="project-create">
        <div class="project-create__main">
            <h3 class="project-create__header">{{ l10n.createProject }}</h3>
            <Input class="project-create__main__name" :placeholder="l10n.nameYourProject"/>

            <Textarea :placeholder="l10n.description"/>

            <Checkbox :label="l10n.public" outlined/>

            <div class="sb sb--small project-create__plugins">
                <h6 class="project-create__plugins__header">Add plugins</h6>

                <div class="list">
                    <div class="project-create__plugins__el"
                         :class="{active: addedPlugins.has(1)}"
                         @click="togglePlugin(1)">
                        <span class="project-create__plugins__el__name">
                            Idea
                            <i class="fas fa-check"></i>
                        </span>
                        <p class="project-create__plugins__el__description">
                            This plugin lets you create ideas on behalf of project
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="material-btn material-btn--flat project-create__done" @click="done">
            {{ l10n.done }}
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/pages/project/create';
</style>

<script>
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Checkbox from '../../components/ui/Checkbox'

export default {
    name: 'project-create',

    components: {
        Checkbox,
        Textarea,
        Input,
    },

    data() {
        return {
            l10n: this.$t('page.project.create'),
            addedPlugins: new Set([1]),
        }
    },

    methods: {
        async done() {

        },

        togglePlugin(id) {
            this.addedPlugins.has(id) ? this.addedPlugins.delete(id) : this.addedPlugins.add(id)
            this.$forceUpdate()
        },
    },
}
</script>
