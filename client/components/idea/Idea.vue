<template>
    <div class="idea">
        <header class="idea__header">
            <nuxt-link :to="'/user/' + user.uid" class="btn idea__header__user">
                <div class="idea__header__user__avatar">
                    <img :src="user.avatar" alt="avatar">
                </div>
                <span class="idea__header__user__nickname">
                    {{user.nickname}}
                </span>
            </nuxt-link>
        </header>

        <div class="idea-body">
            <h3 class="idea-body__name">
                {{name}}
            </h3>
            <p class="idea-body__text">
                {{text}}
            </p>
        </div>

        <footer class="idea-footer">
            <div class="base-btn idea-footer__btn idea-footer__btn--like" :class="likedByUser ? 'liked' : ''" @click="like">
                <i :class="likedByUser ? 'fas' : 'far'" class="fa-heart"></i>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Idea',

    props: [
        'id',
        'name',
        'text',
        'liked',
        'user',
    ],

    data() {
        return {
            likedByUser: this.liked,
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
                this.$toast.show(error.message)
            }
        }
    }
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/idea.scss';
</style>
