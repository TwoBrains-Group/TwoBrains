<template>
    <div class="ui-switch" :class="{checked, outlined}" @click="toggle">
        <label>{{ leftLabel }}</label>
        <div class="ui-switch__box">
            <div class="ui-switch__box__thumb"></div>
        </div>
        <label>{{ rightLabel }}</label>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/Switch';
</style>

<script>
export default {
    name: 'ToggleSwitch',

    props: {
        initChecked: {
            type: Boolean,
        },
        leftLabel: {
            type: String,
        },
        rightLabel: {
            type: String,
        },
        outlined: {
            type: Boolean,
        },
    },

    data() {
        return {
            checked: !!this.initChecked,
        }
    },

    methods: {
        toggle() {
            this.checked = !this.checked

            this.$emit('toggle', this.checked)
        },
    },
}
</script>
