<template>
    <div :data-scroll="scroll" :data-debounce="String(debounce)" @scroll.passive="storeScroll">
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'Debounce',

    data() {
        return {
            scroll: 0,
            debounce: false,
            threshold: 1,
        }
    },

    methods: {
        storeScroll() {
            this.scroll = this.$el.scrollTop
            this.debounce = this.scroll < this.threshold
        },
    },

    mounted() {
        this.storeScroll()
    },
}
</script>
