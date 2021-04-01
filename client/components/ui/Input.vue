<template>
    <div class="ui-input"
         :class="{
            ringError,
            warn,
            small: size === 'small',
            normal: size === 'normal',
            big: size === 'big',
            focused,
         }">
        <input :type="type"
               @focusin="focused = true"
               @focusout="focused = false"
               @input="changed"
               :placeholder="placeholder"
               ref="input"
               :value="value"
               @keyup.enter="applyEnter">

        <div class="ui-input__hint" v-if="keyHint">
            {{ keyHint }}
        </div>

        <div class="ui-input__len-info"
             :class="{warn: lenWarn, error: lenError || ringError, show: focused && lenInfo.length}">{{ lenInfo }}
        </div>

    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/Input';
</style>

<script>
import InputConstants from '@/constants/Input'

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
        regexp: {
            type: RegExp,
            default: null,
        },
        regexpErrMsg: {
            type: String,
            default: '',
        },
        regexpWarn: {
            type: Boolean,
            default: false,
        },
        enter: {
            type: Function,
        },
        enterOnUnchanged: {
            type: Boolean,
        },
        inputOnUnchanged: {
            type: Boolean,
            default: true,
        },
        keyHint: {
            type: String,
        },
        size: {
            type: String,
            default: 'normal',
            validator(val) {
                return ['small', 'normal', 'big'].includes(val)
            },
        },
        preset: {
            type: String,
            validator(val) {
                if (val) {
                    return Object.keys(InputConstants.presets).includes(val)
                }
                return true
            },
        },
    },

    data() {
        return {
            l10n: this.$t('cmp.*.Textarea'),

            focused: false,
            lenInfo: '',
            lenWarn: false,
            lenError: false,
            ringError: false,
            warn: false,
            oldValue: '',
            preset$: null,
        }
    },

    // TODO: Presets
    // created() {
    //     if (this.preset) {
    //         this.preset$ = InputConstants.presets[this.preset]
    // }
    // },

    methods: {
        testRegexp() {
            return this.regexp.test(this.$refs.input.value)
        },

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
                this.lenWarn = len > this.warnLen
            }

            this.lenError = len > this.maxLen

            if (this.regexp) {
                this.warn = !this.testRegexp()
            }

            if (this.inputOnUnchanged || val !== this.oldValue) {
                this.$emit('input', val)
                this.oldValue = val
            }
        },

        ring() {
            if (this.ringTimeout) {
                clearTimeout(this.ringTimeout)
            }
            this.ringTimeout = setTimeout(() => this.ringError = false, 2500)

            this.ringError = true
        },

        test(ring = true) {
            const val = this.$refs.input.value
            const len = val.length

            if (this.regexp && !this.testRegexp()) {
                if (ring) {
                    this.ring()
                    if (this.regexpErrMsg) {
                        this.$toast.error(this.regexpErrMsg)
                    }
                }
                return false
            }

            if (len < this.minLen || len > this.maxLen) {
                if (ring) {
                    this.ring()
                }
                return false
            }

            return true
        },

        clear() {
            this.value = ''
            this.$refs.input.value = ''
        },

        focus() {
            this.$refs.input.focus()
        },

        applyEnter() {
            if (this.enter) {
                const value = this.$refs.input.value
                if (this.enterOnUnchanged || value !== this.oldValue) {
                    this.enter(value)
                }
                this.oldValue = value
            }
        },
    },
}
</script>
