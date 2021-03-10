<template>
    <div class="idea__comments__comment" :class="isReply ? 'reply' : ''" v-bind:isReply="false">
        <nuxt-link :to="'/user/' + user.uid" class="btn idea__comments_comment__user">
            <div class="idea__comments__comment__user__avatar">
                <img :src="user.avatar" alt="avatar">
            </div>
            <span class="idea__comments__comment__user__nickname">{{ user.nickname }}</span>
            <span class="idea__comments__comment__date"> - {{ creationDatetime }}</span>
        </nuxt-link>

        <div class="idea__comments__comment__content">
            <nuxt-link v-if="isReply"
                       :to="'/user/' + rootCommentUserUid"
                       class="idea__comments__comment__content__reply-to">@{{rootCommentUserNickname}}, </nuxt-link>{{ text }}</div>

        <footer class="idea__comments__comment__footer">
            <div class="base-btn idea__comments__comment__footer__btn idea__comments__comment__footer__btn--like"
                 :class="likedByUser ? 'liked' : ''"
                 @click="like">
                <i :class="likedByUser ? 'fas' : 'far'" class="fa-heart"></i>
            </div>

            <div v-if="!isReply"
                 class="idea__comments__comment__footer__btn idea__comments__comment__footer__btn--replies"
                 @click="toggleReplies">
                <span v-if="!showReplies">Show replies</span>
                <span v-else>Close replies</span>
            </div>
        </footer>

        <div class="idea__comments__comment__replies" v-if="!isReply && showReplies">
            <div class="idea__comments__comment__replies__line"></div>
            <div class="idea__comments__comment__replies__list">
                <IdeaComment v-for="reply of replies"
                             :key="reply.id"
                             v-bind="reply"
                             v-bind:isReply="true"/>
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
    components: {InfiniteScroll},
    props: [
        'id',
        'user',
        'text',
        'creationDatetime',
        'liked',
        'isReply',
        'rootCommentUserUid',
        'rootCommentUserNickname',
    ],

    data() {
        return {
            // firstRepliesCount: 5,
            firstRepliesCount: null,
            likedByUser: this.liked,
            showReplies: false,
            replies: [],
            repliesFetched: false,
        }
    },

    methods: {
        async like() {
            try {
                const {liked} = await this.$api.send({
                    app: 'idea',
                    method: 'likeComment',
                    params: {
                        id: this.id,
                    },
                    v: 1,
                })

                this.likedByUser = liked
            } catch (error) {
                this.$toast.error('Failed to liked comment')
            }
        },

        async fetchReplies() {
            if (this.repliesFetched) {
                return
            }
            try {
                const limit = this.replies.length ? null : this.firstRepliesCount
                const {comments} = await this.$api.send({
                    app: 'idea',
                    method: 'getComments',
                    params: {
                        replyTo: this.id,
                        limit,
                        offset: this.replies.length,
                    },
                    v: 1,
                })

                this.replies.push(...comments)
            } catch (error) {
                console.log('Error:', error)
                this.$toast.error('Failed to load replies')
            } finally {
                this.fetchingReplies = false
            }
        },

        async toggleReplies() {
            this.showReplies = !this.showReplies
            if (!this.showReplies) {
                return
            }

            await this.fetchReplies()
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/IdeaComment';
</style>
