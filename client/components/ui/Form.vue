<template>
    <div class="ui-form" @keyup.ctrl.enter="apply">
        <slot/>
    </div>
</template>

<style lang="scss">
</style>

<script>
export default {
    name: 'Form',

    // beforeMount() {
    //     window.addEventListener('keyup', e => {
    //         if (e.ctrlKey && e.code === 'Enter') {
    //             this.apply()
    //         }
    //     })
    // },
    //
    // beforeDestroy() {
    //     window.removeEventListener('keyup', this.apply)
    // },

    methods: {
        apply() {
            this.$emit('apply')
        },
    },
}
</script>
