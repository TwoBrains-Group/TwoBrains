<template>
    <div class="ui-Checkbox" :class="{_checked: checked, _outlined: outlined}" @click="toggle">
        <label>{{ label }}</label>
        <div class="ui-Checkbox_box">
            <i class="fas" :class="{'fa-check': checked}"></i>
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/Checkbox';
</style>

<script>
export default {
    name: 'Checkbox',

    props: {
        label: {
            type: String,
        },
        initChecked: {
            type: Boolean,
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
        },
    },
}
</script>
