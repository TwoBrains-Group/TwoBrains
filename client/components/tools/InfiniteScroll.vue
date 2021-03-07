<template>
    <client-only>
        <!-- TODO: Add distance -->
        <infinite-loading @infinite="fetch">
            <div slot="spinner">
                <Spinner/>
            </div>
            <h5 slot="no-more" :class="!noMore ? 'hide-no-more' : ''">No more :(</h5>
            <h5 slot="no-results" :class="!noResult ? 'hide-no-result' : ''">Nothing here...</h5>
        </infinite-loading>
    </client-only>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Spinner from '@/components/common/Spinner'

export default {
    components: {InfiniteLoading, Spinner},

    props: [
        // 'distance',
        'noResult',
        'noMore',
    ],

    methods: {
        fetch($state) {
            this.$emit('fetch', $state)
        }
    }
}
</script>
