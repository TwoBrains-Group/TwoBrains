<template>
    <div class="tag-TagSearch">
        <h6 class="tag-TagSearch_header" v-if="header">{{ header || l10n.defaultHeader }}</h6>
        <div class="tag-TagSearch_searchBar">
            <Input type="text" @input="search" size="small" :input-on-unchanged="false"/>
        </div>

        <div class="tag-TagSearch_list">
            <div class="btn tag-TagSearch_list_el"
                 v-for="tag of tags"
                 @click="toggleTag(tag.id)"
                 :class="{active: addedTags.has(tag.id)}">
                <span class="tag-TagSearch_list_el_group" v-if="tag.groupLabel">{{ tag.groupLabel }}:</span>
                {{ tag.label }}
                <i class="fas fa-check"></i>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
            if (!value.length) {
                return
            }

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
