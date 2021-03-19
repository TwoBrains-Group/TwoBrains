<template>
    <div class="tag-search">
        <h4 class="tag-search__header" v-if="header">{{ header }}</h4>
        <div class="tag-search__search-bar">
            <Input type="text" @input="search"/>
        </div>

        <div class="tag-search__list">
            <div class="tag-search__list__el"
                 v-for="tag of tags"
                 @click="toggleTag(tag.id)"
                 :class="{active: addedTags.has(tag.id)}">
                <span class="group" v-if="tag.groupLabel">{{ tag.groupLabel }}:</span>
                {{ tag.label }}
            </div>
        </div>
    </div>
</template>

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
        async search() {

        },

        toggleTag(id) {
            this.addedTags.has(id) ? this.addedTags.delete(id) : this.addedTags.add(id)
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/tag/TagSearch';
</style>
