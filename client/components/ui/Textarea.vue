<template>
    <div class="ui-textarea" :class="{ringError}">
        <textarea @focusin="focused = true"
                  @focusout="focused = false"
                  class="sb sb--round"
                  @input="changed"
                  :placeholder="placeholder"
                  ref="textarea"></textarea>

        <div class="ui-textarea__len-info"
             :class="{warn, error: error || ringError, show: focused || ringError}">{{ lenInfo }}
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/Textarea';
</style>

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
            ringError: false,
        }
    },

    methods: {
        changed(e) {
            const val = e.target.value
            const len = val.length

            this.ringError = false

            if (this.minLen !== 0 && len < this.minLen) {
                this.lenInfo = this.$l10n.format(this.l10n.moreToGo, {
                    count: this.minLen - len,
                })
            } else if (this.minLen !== 0 && len > this.maxLen) {
                this.lenInfo = this.$l10n.format(this.l10n.tooLongBy, {
                    count: len - this.maxLen,
                })
            } else if (this.maxLen !== Infinity) {
                this.lenInfo = this.$l10n.format(this.l10n.charactersLeft, {
                    count: this.maxLen - len,
                })
                this.ringError = false
            }

            if (this.warnLen) {
                this.warn = len > this.warnLen
            }

            this.error = len > this.maxLen

            this.$emit('input', val)
        },

        test() {
            const len = this.$refs.textarea.value.length

            if (len < this.minLen || len > this.maxLen) {
                this.ringError = true

                if (this.ringTimeout) {
                    clearTimeout(this.ringTimeout)
                }
                this.ringTimeout = setTimeout(() => this.ringError = false, 2500)

                return false
            }

            return true
        },

        clear() {
            this.$refs.textarea.value = ''
        },

        focus() {
            this.$refs.textarea.focus()
        },
    },
}
</script>
