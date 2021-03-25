<template>
    <div class="tag-search">
        <h6 class="tag-search__header" v-if="header">{{ header || l10n.defaultHeader }}</h6>
        <div class="tag-search__search-bar">
            <Input type="text" @input="search" size="small" :input-on-unchanged="false"/>
        </div>

        <div class="tag-search__list">
            <div class="btn tag-search__list__el"
                 v-for="tag of tags"
                 @click="toggleTag(tag.id)"
                 :class="{active: addedTags.has(tag.id)}">
                <span class="group" v-if="tag.groupLabel">{{ tag.groupLabel }}:</span>
                {{ tag.label }}
                <i class="fas fa-check"></i>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/tag/TagSearch';
</style>

<script>
import Input from '@/components/ui/Input'

export default {
    name: 'TagSearch',

    components: {
        Input,
    },

    props: {
        header: {
            type: String,
        },
    },

    data() {
        return {
            l10n: {
                tags: this.$t('entities.tags'),
                tagGroups: this.$t('entities.tagGroups'),
                ...this.$t('cmp.*.TagSearch'),
            },

            tags: [],
            addedTags: new Set(),
        }
    },

    async fetch() {
        try {
            const params = {}

            const {tags} = await this.$api.send({
                app: 'tag',
                method: 'getTop',
                params,
                v: 1,
            })

            this.tags = tags
        } catch (error) {
            this.$toast.error('Failed to load tags')
        }
    },

    methods: {
        async search(value) {
            const params = {
                text: value,
            }

            try {
                const {tags} = await this.$api.send({
                    app: 'tag',
                    method: 'search',
                    params,
                    v: 1,
                })

                this.tags = tags

                // TODO!: Show added tags
            } catch (error) {
                this.$toast.error('Failed to load tags')
            }
        },

        toggleTag(id) {
            this.addedTags.has(id) ? this.addedTags.delete(id) : this.addedTags.add(id)
            this.$forceUpdate()
        },
    },
}
</script>
