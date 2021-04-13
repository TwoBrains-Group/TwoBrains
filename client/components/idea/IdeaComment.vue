<template>
    <div class="idea-IdeaComment"
         :class="{reply: isReply}"
         v-bind:isReply="false">
        <header class="idea-IdeaComment_header">
            <nuxt-link :to="'/user/' + user.uid" class="btn idea-IdeaComment_header_user">
                <div class="idea-IdeaComment_user_avatar">
                    <img :src="user.avatar" alt="avatar">
                </div>
                <span class="idea-IdeaComment_user_nickname">{{ user.nickname }}</span>
                <span class="idea-IdeaComment_user_date"> - {{ creationDatetime }}</span>
            </nuxt-link>

            <div class="idea-IdeaComment_header_options">
                <div class="btn idea-IdeaComment_header_options_el"
                     @click="deleteComment"
                     v-show="showOptions">{{ l10n.delete }}
                </div>
            </div>

            <div class="u-right">
                <div class="btn idea-IdeaComment_headerBtn" @click="showOptions = !showOptions">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        </header>

        <div class="idea-IdeaComment_content">
            <nuxt-link v-if="isReply"
                       :to="'/user/' + rootCommentUserUid"
                       class="idea-IdeaComment_content_reply-to">@{{ rootCommentUserNickname }},
            </nuxt-link>
            {{ text }}
        </div>

        <footer class="idea-IdeaComment_footer">
            <div class="base-btn idea-IdeaComment_footer_btn _like"
                 :class="liked$ ? 'liked' : ''"
                 @click="like">
                <i :class="liked$ ? 'fas' : 'far'" class="fa-heart"></i>
                <span class="count">{{ likesCount$ }}</span>
            </div>

            <div v-if="!isReply"
                 class="idea-IdeaComment_footer_btn _openReplies"
                 @click="toggleReplies">
                <span v-if="!showReplies">{{ l10n.showReplies }}</span>
                <span v-else>{{ l10n.closeReplies }}</span>
            </div>

            <div class="idea-IdeaComment_footer_btn _reply"
                 @click="beginReply">
                {{ l10n.reply }}
            </div>
        </footer>

        <div class="idea-IdeaComment_replies" v-if="showReplies">
            <div class="idea-IdeaComment_replies_line"></div>
            <div class="idea-IdeaComment_replies_list">
                <WriteComment v-if="showReplies" ref="writeReply" type="comment" :id="id" @done="replied"/>

                <IdeaComment v-for="reply of replies"
                             :key="reply.id"
                             v-bind="reply"
                             v-bind:isReply="true"
                             v-if="!isReply && showReplies"/>

                <div v-if="!allRepliesFetched && showReplies"
                     @click="fetchReplies"
                     class="base-btn idea-IdeaComment_replies_list_loadMore">Load more
                </div>
            </div>

            <!--            <InfiniteScroll @fetch="fetchReplies"/>-->
        </div>
<!--        <div class="idea-IdeaComment_repliesStub" v-else></div>-->
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/idea/IdeaComment';
</style>

<script>
import WriteComment from '@/components/idea/WriteComment'
import InfiniteScroll from '@/components/tools/InfiniteScroll'

export default {
    name: 'IdeaComment',

    components: {
        WriteComment,
        InfiniteScroll,
    },

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
        this.likesCount$ = Number(this.likesCount$) || ''
    },

    data() {
        return {
            l10n: this.$t('cmp.idea.IdeaComment'),

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

                this.$toast.show(this.l10n.commentSuccessfullyDeleted)

                this.$destroy()
                this.$el.parentNode.removeChild(this.$el)
            } catch (error) {
                this.$toast.error(this.l10n.failedToDeleteComment)
            }
        },

        async beginReply() {
            this.showReplies = true

            this.$nextTick(() => this.$refs.writeReply.focus())

            if (this.firstRepliesFetch) {
                await this.fetchReplies()
            }
        },

        async replied() {
            this.repliesOffset = 0
            this.replies = []
            await this.fetchReplies()
        },
    },
}
</script>
