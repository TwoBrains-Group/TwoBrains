<template>
    <div class="idea-Idea"
         :class="{
            'comments-open': showComments,
            page: isPage,
            hover
         }">

        <div class="idea-Idea_block">
            <header class="idea-Idea_block_header">
                <nuxt-link :to="'/user/' + user.uid" class="btn idea-Idea_block_header_user">
                    <div class="idea-Idea_block_header_user_avatar">
                        <img :src="user.avatar" alt="avatar">
                    </div>
                    <span class="idea-Idea_block_header_user_nickname">{{ user.nickname }}</span>
                </nuxt-link>

                <nuxt-link :to="'/idea/' + id" class="idea-Idea_block_creation-datetime" v-tooltip="{
                    content: creationDatetime,
                    offset: 0
                }">
                    {{ prettyCreationDatetime }}
                </nuxt-link>

                <div class="u-right">
                    <div class="btn idea-Idea_block_header_options-btn" @click="toggleOptions">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>

                    <div class="idea-Idea_block_header_options" v-show="showOptions">
                        <div class="btn idea-Idea_block_header_options_el">
                            {{ l10n.edit }}
                        </div>
                        <div class="btn idea-Idea_block_header_options_el">
                            {{ l10n.delete || 'delete' }}
                        </div>
                    </div>
                </div>
            </header>

            <nuxt-link :to="'/idea/' + id"
                       class="idea-Idea_block_body"
                       @mouseover.native="hover = true"
                       @mouseleave.native="hover = false">

                <h3 class="idea-Idea_block_body_name">
                    {{ name }}
                </h3>
                <p class="idea-Idea_block_body_text">
                    {{ text }}
                </p>
            </nuxt-link>

            <footer class="idea-Idea_block_footer">
                <div class="base-btn idea-Idea_block_footer_btn _like"
                     :class="liked$ ? 'liked' : ''"
                     @click="like(false)">
                    <i :class="liked$ ? 'fas' : 'far'" class="fa-heart"></i>
                    <span class="count">{{ likesCount$ }}</span>
                </div>

                <div class="base-btn idea-Idea_block_footer_btn _dislike"
                     :class="disliked$ ? 'disliked' : ''"
                     @click="like(true)">
                    <i :class="disliked$ ? 'fas' : 'far'" class="fa-frown-open"></i>
                    <span class="count">{{ dislikesCount$ }}</span>
                </div>

                <div class="base-btn idea-Idea_block_footer_btn _comments"
                     @click="toggleComments"
                     v-if="!isPage">
                    <i :class="showComments ? 'fas' : 'far'" class="fa-comments"></i>
                </div>

                <div class="idea-Idea_block_footer_tags" v-if="Object.keys(tags).length">
                    <span class="idea-Idea_block_footer_tags_hash">#</span>
                    <nuxt-link :to="getTagSearchUrl(tag.id)"
                               class="btn idea-Idea_block_footer_tags_el"
                               v-for="tag of tags"
                               :key="tag.id">
                        <span class="tag-TagSearch_list_el_group" v-if="tag.groupLabel">{{ l10n.tagGroups.meow }}:</span>
                        {{ l10n.tags['lol'] }}
                        <!--                        <span class="group" v-if="tag.groupLabel">{{ l10n.tagGroups[tag.groupLabel] }}:</span>-->
                        <!--                        {{ l10n.tags[tag.label] }}-->
                    </nuxt-link>
                </div>
            </footer>
        </div>

        <Debounce class="u-sb debounce-shadow idea-Idea_comments" :class="{show: showComments}">
            <WriteComment class="idea-Idea_comments_WriteComment" type="idea" :id="id" @done="commented"/>

            <IdeaComment class="idea-Idea_comments_IdeaComment"
                         v-for="cmt of comments"
                         :key="cmt.id"
                         v-bind="cmt"
                         :is-reply="false"/>

            <InfiniteScroll ref="infiniteScroll" @fetch="commentsInfiniteScroll"/>
        </Debounce>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/idea/Idea';
</style>

<script>
import InfiniteScroll from '@/components/tools/InfiniteScroll'
import IdeaComment from '@/components/idea/IdeaComment'
import Debounce from '@/components/ui/Debounce'
import {ideaFetching} from '@/constants/fetching'
import WriteComment from '@/components/idea/WriteComment'

export default {
    name: 'Idea',

    components: {
        Debounce,
        WriteComment,
        IdeaComment,
        InfiniteScroll,
    },
    fetchKey: 'user-ideas',

    props: [
        'id',
        'name',
        'text',
        'likeExists',
        'liked',
        'disliked',
        'user',
        'creationDatetime',
        'prettyCreationDatetime',
        'isPage',
        'likesCount',
        'dislikesCount',
        'tags',
    ],

    created() {
        this.likesCount$ = Number(this.likesCount$) || ''
        this.dislikesCount$ = Number(this.dislikesCount$) || ''
    },

    data() {
        return {
            l10n: {
                ...this.$t('cmp.idea.Idea'),
                tags: this.$t('entities.tags'),
                tagGroups: this.$t('entities.tagGroups'),
            },

            hover: false,
            liked$: this.likeExists && this.liked,
            disliked$: this.likeExists && this.disliked,
            likesCount$: this.likesCount,
            dislikesCount$: this.dislikesCount,

            showOptions: false,

            comments: [],
            showComments: false,
            commentsOffset: 0,
            commentsFirstFetch: true,
        }
    },

    mounted() {
        if (this.isPage) {
            this.toggleComments()
        }
    },

    methods: {
        async like(dislike) {
            try {
                const params = {
                    dislike,
                    id: this.id,
                }

                const {
                    exists,
                    dislike: disliked,
                    likesCount,
                    dislikesCount,
                } = await this.$api.send({
                    app: 'idea',
                    method: 'like',
                    params,
                    v: 1,
                })

                this.liked$ = exists && !disliked
                this.disliked$ = exists && disliked
                this.likesCount$ = Number(likesCount) || ''
                this.dislikesCount$ = Number(dislikesCount) || ''
            } catch (error) {
                this.$toast.error(error.message)
            }
        },

        async commentsInfiniteScroll($state) {
            const count = await this.fetchComments()
            if (count > 0) {
                this.commentsOffset += count
                $state.loaded()
            } else {
                $state.complete()
            }
        },

        async fetchComments() {
            const params = {
                id: this.id,
                limit: ideaFetching.commentsLimit,
                offset: this.commentsOffset,
            }

            try {
                const {comments} = await this.$api.send({
                    app: 'idea',
                    method: 'getComments',
                    params,
                    v: 1,
                })

                this.comments.push(...comments)

                return comments.length
            } catch (error) {
                this.$toast.error(this.l10n.failedToLoadComments)
            }
        },

        async toggleComments() {
            // Don't fetch again on comments toggle
            this.showComments = !this.showComments
            if (this.commentsFirstFetch) {
                this.$refs.infiniteScroll.manual()
            }
        },

        commented() {
            this.commentsOffset = 0
            this.comments = []
            this.fetchComments()
            // TODO: Prepend comment
        },

        getTagSearchUrl(tagId) {
            return `/idea/search?tags=[${tagId}]`
        },

        toggleOptions() {
            this.showOptions = !this.showOptions
        },
    },
}
</script>
