<template>
    <form class="ui-InputFile" ref="form" @drop.prevent="drop" @dragover.prevent>
        <div class="btn ui-InputFile_container" @click="$refs.input.click()">
            <input type="file" ref="input" :accept="accept" @change="updateChosen">
            <span class="ui-InputFile_container_text"
                  :class="{skeleton: !l10n.chooseFile.length}" ref="text">{{ l10n.chooseFile }}</span>
            <span class="ui-InputFile_container_chosen" v-show="chosen.length">{{ chosen }}</span>
        </div>

        <div class="btn ui-InputFile_remove" v-show="chosen.length" @click="clear">
            <i class="fas fa-times"></i>
        </div>

        <div class="ui-InputFile_preview" v-if="preview">
            <img src="" alt="" ref="previewImage">
        </div>
    </form>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/InputFile';
</style>

<script>
// TODO: Multiple files. Store files in data.

export default {
    name: 'InputFile',

    props: [
        'text',
        'accept',
        'change',
        'preview',
        'remove',
    ],

    data() {
        return {
            l10n: this.$t('cmp.*.InputFile'),

            chosen: '',
        }
    },

    methods: {
        updateChosen(e) {
            if (e.target.files.length) {
                this.chosen = e.target.files[0].name

                if (this.change) {
                    this.change(e.target.files)
                }

                if (this.preview) {
                    const reader = new FileReader()

                    reader.onload = e => {
                        this.$refs.previewImage.src = reader.result
                    }

                    reader.readAsDataURL(e.target.files[0])
                }
            }
        },

        clear() {
            this.$refs.form.reset()
            this.chosen = ''
            this.change('')
            this.$refs.previewImage.src = ''

            if (this.remove) {
                this.remove()
            }
        },

        drop(e) {
            this.change(e.dataTransfer.files)
        },
    },
}
</script>
