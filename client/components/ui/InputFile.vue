<template>
    <form class="ui-input-file" ref="form" @drop.prevent="drop" @dragover.prevent>
        <div class="btn ui-input-file__container" @click="$refs.input.click()">
            <input type="file" ref="input" :accept="accept" @change="updateChosen">
            <span class="ui-input-file__container__text"
                  :class="{skeleton: !l10n.chooseFile.length}" ref="text">{{ l10n.chooseFile }}</span>
            <span class="ui-input-file__container__chosen" v-show="chosen.length">{{ chosen }}</span>
        </div>

        <div class="btn ui-input-file__remove" v-show="chosen.length" @click="clear">
            <i class="fas fa-times"></i>
        </div>

        <div class="ui-input-file__preview" v-if="preview">
            <img src="" alt="" ref="previewImage">
        </div>
    </form>
</template>

<script>
// TODO: Multiple files. Store files in data.

export default {
    name: 'InputFile',

    fetchOnServer: false,

    props: [
        'text',
        'accept',
        'change',
        'preview',
        'remove',
    ],

    created() {
        if (process.client) {
            this.$l10n.component(this)
        }
    },

    data() {
        return {
            app: '*',

            l10n: {
                chooseFile: '',
            },

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

<style lang="scss">
@import '~assets/sass/components/ui/InputFile';
</style>
