<template>
    <div class="idea__comments__comment"
         :class="{reply: isReply}"
         v-bind:isReply="false">
        <header class="idea__comments__comment__header">
            <nuxt-link :to="'/user/' + user.uid" class="btn idea__comments_comment__user">
                <div class="idea__comments__comment__user__avatar">
                    <img :src="user.avatar" alt="avatar">
                </div>
                <span class="idea__comments__comment__user__nickname">{{ user.nickname }}</span>
                <span class="idea__comments__comment__date"> - {{ creationDatetime }}</span>
            </nuxt-link>

            <div class="idea__comments__comment__header__options">
                <div class="btn idea__comments__comment__header__options__el"
                     @click="deleteComment"
                     v-show="showOptions">{{ l10n.delete }}
                </div>
            </div>

            <div class="right">
                <div class="btn idea__comments__comment__user__options-btn" @click="showOptions = !showOptions">
                    <i class="fas fa-ellipsis-h"></i>
                </div>

                <div></div>
            </div>
        </header>

        <div class="idea__comments__comment__content">
            <nuxt-link v-if="isReply"
                       :to="'/user/' + rootCommentUserUid"
                       class="idea__comments__comment__content__reply-to">@{{ rootCommentUserNickname }},
            </nuxt-link>
            {{ text }}
        </div>

        <footer class="idea__comments__comment__footer">
            <div class="base-btn idea__comments__comment__footer__btn idea__comments__comment__footer__btn--like"
                 :class="liked$ ? 'liked' : ''"
                 @click="like">
                <i :class="liked$ ? 'fas' : 'far'" class="fa-heart"></i>
                <span class="count">{{ likesCount$ }}</span>
            </div>

            <div v-if="!isReply"
                 class="idea__comments__comment__footer__btn idea__comments__comment__footer__btn--replies"
                 @click="toggleReplies">
                <span v-if="!showReplies">{{ l10n.showReplies }}</span>
                <span v-else>{{ l10n.closeReplies }}</span>
            </div>

            <div class="idea__comments__comment__footer__btn idea__comments__comment__footer__btn--reply"
                 @click="reply">

            </div>
        </footer>

        <div class="idea__comments__comment__replies" v-if="!isReply && showReplies">
            <div class="idea__comments__comment__replies__line"></div>
            <div class="idea__comments__comment__replies__list">
                <IdeaComment v-for="reply of replies"
                             :key="reply.id"
                             v-bind="reply"
                             v-bind:isReply="true"/>

                <div v-if="!allRepliesFetched"
                     @click="fetchReplies"
                     class="base-btn idea__comments__comment__replies__list__load-more">Load more
                </div>
            </div>

            <!--            <InfiniteScroll @fetch="fetchReplies"/>-->
        </div>
        <div class="idea__comments__comment__replies_stub" v-else></div>
    </div>
</template>

<script>
import InfiniteScroll from '@/components/tools/InfiniteScroll'

export default {
    name: 'IdeaComment',
    fetchOnServer: false,

    components: {InfiniteScroll},
    props: [
        'id',
        'user',
        'text',
        'creationDatetime',
        'liked',
        'likesCount',
        'isReply',
        'rootCommentUserUid',
        'rootCommentUserNickname',
    ],

    created() {
        if (process.client) {
            this.$l10n.component(this)
        }

        this.likesCount$ = Number(this.likesCount$) || ''
    },

    data() {
        return {
            app: 'idea',

            l10n: {
                delete: 'Delete',
                edit: 'Edit',
                showReplies: 'Show replies',
                closeReplies: 'Close replies',
                reply: 'Reply',
                failedToLikeComment: 'Failed to like comment',
                failedToLoadReplies: 'Failed to load replies',
                failedToDeleteComment: 'Failed to delete comment',
                failedToReply: 'Failed to reply',
                commentSuccessfullyDeleted: 'Comment successfully deleted',
                replySuccessfullyAdded: 'Reply successfully added',
            },

            liked$: this.liked,
            likesCount$: this.likesCount,

            showOptions: false,

            showReplies: false,
            replies: [],
            firstRepliesCount: 5,
            firstRepliesFetch: true,
            repliesOffset: 0,
            allRepliesFetched: false,
        }
    },

    methods: {
        async like() {
            try {
                const {
                    liked,
                    count,
                } = await this.$api.send({
                    app: 'idea',
                    method: 'likeComment',
                    params: {
                        id: this.id,
                    },
                    v: 1,
                })

                this.liked$ = liked
                this.likesCount$ = Number(count) || ''
            } catch (error) {
                this.$toast.error(this.l10n.failedToLikeComment)
            }
        },

        async fetchReplies() {
            try {
                const params = {
                    replyTo: this.id,
                    limit: this.firstRepliesFetch ? this.firstRepliesCount : null,
                    offset: this.repliesOffset,
                }

                const {comments} = await this.$api.send({
                    app: 'idea',
                    method: 'getComments',
                    params,
                    v: 1,
                })

                if (!this.firstRepliesFetch) {
                    this.allRepliesFetched = true
                }

                this.repliesOffset += comments.length
                this.replies.push(...comments)
            } catch (error) {
                console.log('Error:', error)
                this.$toast.error(this.l10n.failedToLoadReplies)
            } finally {
                this.firstRepliesFetch = false
            }
        },

        async toggleReplies() {
            this.showReplies = !this.showReplies
            if (!this.showReplies) {
                return
            }

            await this.fetchReplies()
        },

        async deleteComment() {
            try {
                const params = {
                    id: this.id,
                }

                await this.$api.send({
                    app: 'idea',
                    method: 'deleteComment',
                    params,
                    v: 1,
                })

                this.$toast.info(this.l10n.commentSuccessfullyDeleted)

                this.$destroy()
                this.$el.parentNode.removeChild(this.$el)
            } catch (error) {
                this.$toast.error(this.l10n.failedToDeleteComment)
            }
        },

        async reply() {
            try {
                const params = {
                    replyTo: this.id,
                }

                await this.$api.send({
                    app: 'idea',
                    method: 'replyToComment',
                    params,
                    v: 1,
                })

            } catch (error) {
                this.$toast.error(this.l10n.failedToReply)
            }
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/IdeaComment';
</style>
