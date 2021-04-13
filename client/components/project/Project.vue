<template>
    <div class="project-Project"
         :class="{hover}"
         @mouseover="hover = true"
         @mouseleave="hover = false">
        <div class="project-Project_body">
            <div class="project-Project_body_image">
                <img :src="image" alt="Project image">
            </div>

            <div class="project-Project_body_info">
                <nuxt-link :to="url" class="project-Project_body_info_name">
                    {{ name }}
                </nuxt-link>

                <div class="project-Project_body_info_btns">
                    <div class="btn project-Project_body_info_btns_el project-Project_body_info_btns_share"
                         @click="share">
                        <i class="fas fa-share-alt"></i>
                    </div>
                    <Share :link="url" v-show="showShare"/>
                    <div class="btn project-Project_body_info_btns_el project-Project_body_info_btns_options"
                         @click="toggleOptions"
                         v-if="isMine">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>

                <div class="project-Project_body_info_options" v-if="isMine" v-show="showOptions">
                    <nuxt-link v-if="isMine"
                               class="btn project-Project_body_info_options_el"
                               :to="url + '/settings'">
                        {{ l10n.settings || 'settings' }}
                    </nuxt-link>
                </div>

                <nuxt-link :to="url" class="u-sb u-sb--small project-Project_body_info_description">
                    <p>
                        {{ description.slice(0, descriptionLimit) }}
                        {{ description.length > descriptionLimit ? '...' : '' }}
                    </p>
                </nuxt-link>
            </div>
        </div>

        <div class="project-Project_footer" @mouseover.stop @mouseover="hover = false">
            <div class="btn project-Project_footer_like"
                 :class="{liked: liked$}"
                 @click="like">
                <i class="fa-star" :class="liked$ ? 'fas' : 'far'"></i> <span>{{ likesCount$ }}</span>
            </div>

            <div class="project-Project_footer_tags">
                <div class="btn project-Project_footer_tags_el"
                     v-for="tag of tags"
                     :key="tag.id">
                    <span class="tag-TagSearch_list_el_group">{{ tag.groupLabel }}:</span>
                    {{ tag.label }}
                </div>
            </div>

            <div class="project-Project_footer_creator">
                {{ `${l10n.createdBy} ` }}
                <nuxt-link class="project-Project_footer_creator_link" :to="'/user/' + creator.uid">
                    {{ creator.nickname }}
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/project/Project';
</style>

<script>
import Share from '@/components/ui/Share'

export default {
    name: 'project',

    components: {
        Share,
    },

    props: {
        id: {
            type: String,
        },
        uid: {
            type: String,
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
        },
        creationDatetime: {
            type: String,
        },
        creator: {
            type: Object,
        },
        tags: {
            type: Array,
        },
        liked: {
            type: Boolean,
        },
        likesCount: {
            type: [Number, String],
        },
        rights: {
            type: Array,
        },
        isMine: {
            type: Boolean,
        },
    },

    data() {
        return {
            app: 'project',

            l10n: this.$t('cmp.project.Project'),

            url: `/user/${this.creator.uid}/project/${this.uid}`,
            hover: false,
            descriptionLimit: 696,

            liked$: this.liked,
            likesCount$: this.likesCount,

            showOptions: false,
            showShare: false,
        }
    },

    methods: {
        async like() {
            try {
                const params = {
                    id: this.id,
                }

                const {
                    liked,
                    likesCount,
                } = await this.$api.send({
                    app: 'project',
                    method: 'like',
                    params,
                    v: 1,
                })

                this.liked$ = liked
                this.likesCount$ = likesCount
            } catch (error) {
                this.$toast.error('Failed to like project')
            }
        },

        toggleOptions() {
            this.showOptions = !this.showOptions
            this.showShare = false
        },

        share() {
            this.showShare = !this.showShare
            this.showOptions = false
        },
    },
}
</script>
