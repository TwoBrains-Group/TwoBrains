<template>
    <div class="project"
         :class="{hover}"
         @mouseover="hover = true"
         @mouseleave="hover = false">
        <div class="project__body">
            <div class="project__body__image">
                <img :src="image" alt="Project image">
            </div>

            <div class="project__body__info">
                <nuxt-link :to="url" class="project__body__info__name">
                    {{ name }}
                </nuxt-link>

                <div class="project__body__info__btns">
                    <div class="btn project__body__info__btns__el project__body__info__btns__share"
                         @click="share">
                        <i class="fas fa-share-alt"></i>
                    </div>
                    <Share :link="url" v-show="showShare"/>
                    <div class="btn project__body__info__btns__el project__body__info__btns__options"
                         @click="toggleOptions"
                         v-if="isMine">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <div class="options" v-if="isMine" v-show="showOptions">
                        <nuxt-link v-if="isMine" class="btn options__el" :to="url + '/settings'">
                            {{ l10n.settings || 'settings' }}
                        </nuxt-link>
                    </div>
                </div>

                <nuxt-link :to="url" class="sb sb--small project__body__info__description">
                    <p>
                        {{ description.slice(0, descriptionLimit) }}
                        {{ description.length > descriptionLimit ? '...' : '' }}
                    </p>
                </nuxt-link>
            </div>
        </div>

        <div class="project__footer" @mouseover.stop @mouseover="hover = false">
            <div class="btn project__footer__like"
                 :class="{liked: liked$}"
                 @click="like">
                <i class="fa-star" :class="liked$ ? 'fas' : 'far'"></i> <span>{{ likesCount$ }}</span>
            </div>

            <div class="project__footer__tags">
                <div class="btn project__footer__tags__el"
                     v-for="tag of tags"
                     :key="tag.id">
                    <span class="group">{{ tag.groupLabel }}:</span>
                    {{ tag.label }}
                </div>
            </div>

            <div class="project__footer__creator">
                {{ `${l10n.createdBy} ` }}
                <nuxt-link class="project__footer__creator__link" :to="'/user/' + creator.uid">
                    {{ creator.nickname }}
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
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
