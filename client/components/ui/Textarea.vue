<template>
    <div class="ui-textarea">
        <textarea @focusin="focused = true"
                  @focusout="focused = false"
                  class="sb"
                  @input="changed"
                  :placeholder="placeholder"
                  ref="textarea"></textarea>
        <div v-show="focused"
             class="ui-textarea__len-info"
             :class="{warn, error}">{{ lenInfo }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Textarea',

    props: {
        minLen: {
            type: Number,
            default: 0,
        },
        maxLen: {
            type: Number,
            default: Infinity,
        },
        warnLen: {
            type: Number,
            default: null,
        },
        placeholder: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            l10n: this.$t('cmp.*.Textarea'),

            focused: false,
            lenInfo: '',
            warn: false,
            error: false,
        }
    },

    methods: {
        changed(e) {
            const val = e.target.value
            const len = val.length

            if (len < this.minLen) {
                this.lenInfo = `${this.minLen - len} more to go`
            } else if (len > this.maxLen) {
                this.lenInfo = `Too long by ${len - this.maxLen} characters`
            } else {
                this.lenInfo = `${this.maxLen - len} characters left`
            }

            if (this.warnLen) {
                this.warn = len > this.warnLen
            }

            this.error = len > this.maxLen

            this.$emit('input', val)
        },

        test() {
            const len = this.$refs.textarea.value.length

            if (len < this.minLen) {
                throw Error(`${this.minLen - len} more to go`)
            } else if (len > this.maxLen) {
                throw Error(`Too long by ${len - this.maxLen} characters`)
            }
        },

        clear() {
            this.$refs.textarea.value = ''
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/ui/Textarea';
</style>
