<template>
    <client-only>
        <!-- TODO: Add distance -->
        <infinite-loading :force-use-infinite-wrapper="wrapper"
                          @infinite="fetch"
                          :identifier="identifier"
                          ref="infiniteLoading">
            <div slot="spinner">
                <Spinner/>
            </div>

            <h5 slot="no-more" :class="!noMore ? 'hide-no-more' : ''">{{ noMore$ }}</h5>

            <h5 slot="no-results" :class="!noResult ? 'hide-no-result' : ''">
                {{ noResult$ }}
            </h5>

            <nuxt-link slot="no-results"
                       class="flat-btn"
                       v-if="noResultLinkUrl"
                       :to="noResultLinkUrl">{{ noResultLinkText }}
            </nuxt-link>
        </infinite-loading>
    </client-only>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Spinner from '@/components/ui/Spinner'

export default {
    components: {
        InfiniteLoading,
        Spinner,
    },

    props: {
        // 'distance',
        noResult: {},
        noMore: {},
        noResultLinkUrl: {
            type: String,
        },
        noResultLinkText: {
            type: String,
        },
        identifier: {
            type: String,
        },
        wrapper: {
            type: String,
        },
    },

    data() {
        return {
            noMore$: this.noMore || 'No more...',
            noResult$: this.noResult || 'Nothing here 😞',
            fetched: true,
        }
    },

    methods: {
        setFetched() {
            this.fetched = true
        },

        fetch($state) {
            if (!this.fetched) {
                return
            }
            this.fetched = false
            console.log('state', $state)
            this.$emit('fetch', $state)
        },

        manual() {
            this.$nextTick(() => {
                this.$refs.infiniteLoading.attemptLoad()
            })
        },
    },
}
</script>
