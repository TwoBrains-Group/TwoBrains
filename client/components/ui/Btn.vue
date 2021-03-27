<template>
    <div class="material-btn"
         :class="{
            'material-btn--flat': flat,
            disabled,
         }">
        <slot/>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/Btn';
</style>

<script>
export default {
    name: 'Btn',

    props: {
        flat: {
            type: Boolean,
        },
        disabled: {
            type: [Boolean, Function],
        },
    },

    data() {
        return {}
    },

    methods: {
        click() {
            this.$emit('click')
        },
    },
}
</script>

