<template>
    <div id="page-idea-new">
        <div class="new-idea-form">
            <input type="text" class="new-idea-form__name" :placeholder="l10n.nameYourIdea" v-model="name">

            <textarea class="new-idea-form__text" :placeholder="l10n.myIdeaIsAbout" v-model="text"></textarea>

            <div class="material-btn new-idea-form__done" @click="done">
                {{ l10n.done }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'create',

    created() {
        if (process.client) {
            this.$l10n.page(this)
        }
    },

    data() {
        return {
            app: 'idea',

            name: '',
            text: '',
            l10n: {
                done: 'Done',
                myIdeaIsAbout: 'My idea is about...',
                nameYourIdea: 'Name your idea',
            },
        }
    },

    methods: {
        async done() {
            const params = {
                name: this.name,
                text: this.text,
            }

            try {
                const {id} = await this.$api.send({
                    app: 'idea',
                    method: 'create',
                    params,
                    v: 1,
                })

                await this.$router.push(`/idea/${id}`)
            } catch (error) {
                this.$toast.error(error.message)
            }
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/pages/idea/new';
</style>
