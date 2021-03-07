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

            <nuxt-link :to="'/idea/' + id" class="idea__block__body"
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
                     :class="likedByUser ? 'liked' : ''"
                     @click="like">
                    <i :class="likedByUser ? 'fas' : 'far'" class="fa-heart"></i>
                </div>

                <div class="base-btn idea__block__footer__btn idea__block__footer__btn--comments"
                     @click="toggleComments">
                    <i class="fas fa-comment-dots"></i>
                </div>
            </footer>
        </div>

        <div class="sb idea__comments" v-show="showComments">
            <IdeaComment v-for="cmt of comments" :key="cmt.id" v-bind="cmt" :is-reply="false"/>

            <InfiniteScroll @fetch="fetchComments"/>
        </div>
    </div>
</template>

<script>
import InfiniteScroll from "@/components/tools/InfiniteScroll";
import IdeaComment from "@/components/idea/IdeaComment";

export default {
    name: 'Idea',
    components: {IdeaComment, InfiniteScroll},
    props: [
        'id',
        'name',
        'text',
        'liked',
        'user',
        'creationDatetime',
        'prettyCreationDatetime',
        'isPage',
    ],

    data() {
        return {
            comments: [],
            showComments: false,
            limit: 10,
            likedByUser: this.liked,
            fetchingComments: false,
            hover: false,
        }
    },

    methods: {
        async like() {
            try {
                const {liked} = await this.$api.send({
                    app: 'idea',
                    method: 'like',
                    params: {
                        id: this.id,
                    },
                    v: 1,
                })

                this.likedByUser = liked
            } catch (error) {
                this.$toast.error(error.message)
            }
        },

        async fetchComments($state) {
            if (this.fetchingComments) {
                return
            }

            this.fetchingComments = true

            try {
                const {comments} = await this.$api.send({
                    app: 'idea',
                    method: 'getComments',
                    params: {
                        id: this.id,
                        limit: this.limit,
                        offset: this.comments.length,
                    },
                    v: 1,
                })

                this.comments.push(...comments)

                if (!comments.length) {
                    $state && $state.complete()
                } else {
                    $state && $state.loaded()
                }
            } catch (error) {
                this.$toast.error('Failed to load comments')
            } finally {
                this.fetchingComments = false
            }
        },

        async toggleComments() {
            this.showComments = !this.showComments
            if (!this.showComments) {
                return
            }

            await this.fetchComments()
        }
    }
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/Idea.scss';
</style>
