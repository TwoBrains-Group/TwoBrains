<template>
    <div class="idea"
         :class="{
            'comments-open': showComments,
            page: isPage,
            hover,
         }">

        <div class="idea__block">
            <header class="idea__block__header">
                <nuxt-link :to="'/user/' + user.uid" class="btn idea__block__header__user">
                    <div class="idea__block__header__user__avatar">
                        <img :src="user.avatar" alt="avatar">
                    </div>
                    <span class="idea__block__header__user__nickname">{{ user.nickname }}</span>
                </nuxt-link>

                <nuxt-link :to="'/idea/' + id" class="idea__block__creation-datetime" v-tooltip="{
                    content: creationDatetime,
                    offset: 0,
                }">
                    {{ prettyCreationDatetime }}
                </nuxt-link>
            </header>

            <nuxt-link :to="'/idea/' + id"
                       class="idea__block__body"
                       @mouseover.native="hover = true"
                       @mouseleave.native="hover = false">

                <h3 class="idea__block__body__name">
                    {{ name }}
                </h3>
                <p class="idea__block__body__text">
                    {{ text }}
                </p>
            </nuxt-link>

            <footer class="idea__block__footer">
                <div class="base-btn idea__block__footer__btn idea__block__footer__btn--like"
                     :class="liked$ ? 'liked' : ''"
                     @click="like(false)">
                    <i :class="liked$ ? 'fas' : 'far'" class="fa-heart"></i>
                    <span class="count">{{ likesCount$ }}</span>
                </div>

                <div class="base-btn idea__block__footer__btn idea__block__footer__btn--dislike"
                     :class="disliked$ ? 'disliked' : ''"
                     @click="like(true)">
                    <i :class="disliked$ ? 'fas' : 'far'" class="fa-frown-open"></i>
                    <span class="count">{{ dislikesCount$ }}</span>
                </div>

                <div class="base-btn idea__block__footer__btn idea__block__footer__btn--comments"
                     @click="toggleComments"
                     v-if="!isPage">
                    <i :class="showComments ? 'fas' : 'far'" class="fa-comments"></i>
                </div>
            </footer>
        </div>

        <div class="sb idea__comments"
             :class="{show: showComments}">
            <WriteComment :idea-id="id" @done="commented"/>

            <IdeaComment v-for="cmt of comments" :key="cmt.id" v-bind="cmt" :is-reply="false"/>

            <InfiniteScroll ref="infiniteScroll" @fetch="commentsInfiniteScroll"/>
        </div>
    </div>
</template>

<script>
import InfiniteScroll from '@/components/tools/InfiniteScroll'
import IdeaComment from '@/components/idea/IdeaComment'
import {ideaFetching} from '@/constants/fetching'
import WriteComment from '@/components/idea/WriteComment'

export default {
    name: 'Idea',

    components: {WriteComment, IdeaComment, InfiniteScroll},
    fetchKey: 'user-ideas',
    fetchOnServer: false,

    props: [
        'id',
        'name',
        'text',
        'liked',
        'disliked',
        'user',
        'creationDatetime',
        'prettyCreationDatetime',
        'isPage',
        'likesCount',
        'dislikesCount',
    ],

    created() {
        if (process.client) {
            this.$l10n.component(this)
        }

        this.likesCount$ = Number(this.likesCount$) || ''
        this.dislikesCount$ = Number(this.dislikesCount$) || ''
    },

    mounted() {
        if (this.isPage) {
            this.toggleComments()
        }
    },

    data() {
        return {
            app: '*',
            page: '*',

            l10n: {
                failedToLoadComments: 'Failed to load comments',
                delete: 'Delete',
                edit: 'Edit',
            },

            hover: false,
            liked$: this.liked,
            disliked$: this.disliked,
            likesCount$: this.likesCount,
            dislikesCount$: this.dislikesCount,

            comments: [],
            showComments: false,
            commentsOffset: 0,
            commentsFirstFetch: true,
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
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/Idea';
</style>
