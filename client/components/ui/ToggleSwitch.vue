<template>
    <div class="ui-Switch" :class="{_checked: checked, _outlined: outlined}" @click="toggle">
        <label>{{ leftLabel }}</label>
        <div class="ui-Switch_box">
            <div class="ui-Switch_box_thumb"></div>
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
