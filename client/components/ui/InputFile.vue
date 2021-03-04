<template>
    <form class="ui-input-file" ref="form">
        <div class="btn ui-input-file__container" @click="$refs.input.click()">
            <input type="file" ref="input" :accept="accept" @change="updateChosen">
            <span class="ui-input-file__container__text">{{ text || 'Choose file...' }}</span>
            <span class="ui-input-file__container__chosen" v-show="chosen.length">{{ chosen }}</span>
        </div>

        <div class="btn ui-input-file__remove" v-show="this.chosen" @click="clear">
            <i class="fas fa-times"></i>
        </div>
    </form>
</template>

<script>
export default {
    props: [
        'text',
        'accept',
        'change',
    ],

    data() {
        return {
            chosen: null,
        }
    },

    methods: {
        updateChosen(e) {
            if (e.target.files.length) {
                this.chosen = e.target.files[0].name

                if (this.change) {
                    this.change(e.target.files)
                }
            }
        },

        clear() {
            this.$refs.form.reset()
            this.chosen = ''
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/ui/InputFile';
</style>
