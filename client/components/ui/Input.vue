<template>
    <div class="ui-input" :class="{ringError}">
        <input :type="type"
               @focusin="focused = true"
               @focusout="focused = false"
               @input="changed"
               :placeholder="placeholder"
               ref="input"
               :value="value">

        <div class="ui-input__len-info"
             :class="{warn, error: error || ringError, show: focused}">{{ lenInfo }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Input',

    props: {
        type: {
            type: String,
            default: 'text',
        },
        minLen: {
            type: Number,
            default: 0,
        },
        maxLen: {
            type: Number,
            default: Infinity,
        },
        placeholder: {
            type: String,
            default: '',
        },
        value: {
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
            }

            if (this.warnLen) {
                this.warn = len > this.warnLen
            }

            this.error = len > this.maxLen

            this.$emit('input', val)
        },

        test() {
            const len = this.$refs.input.value.length

            if (len < this.minLen || len > this.maxLen) {
                this.ringError = false
                if (this.ringTimeout) {
                    clearTimeout(this.ringTimeout)
                }
                this.ringTimeout = setTimeout(() => this.ringError = false, 2500)

                this.ringError = true

                return false
            }

            return true
        },

        clear() {
            this.$refs.input.value = ''
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/ui/Input';
</style>
