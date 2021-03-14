<template>
    <div class="idea__comments__write-comment">
        <div class="idea__comments__write-comment__text">
            <Textarea v-model="text"
                      ref="textarea"
                      :placeholder="l10n.writeAComment"
                      :min-len="15"
                      :max-len="600"
                      :warn-len="450"/>
        </div>

        <div class="btn idea__comments__write-comment__done"
             @click="done">
            <i class="fas fa-paper-plane"></i>
        </div>
    </div>
</template>

<script>
import Textarea from '@/components/ui/Textarea'

export default {
    name: 'WriteComment',

    components: {
        Textarea,
    },

    props: [
        'replyTo',
        'ideaId',
    ],

    data() {
        return {
            l10n: this.$t('cmp.idea.WriteComment'),

            text: '',
        }
    },

    methods: {
        async done() {
            if (!this.$refs.textarea.test()) {
                return
            }

            try {
                const params = {
                    ideaId: this.ideaId,
                    text: this.text,
                    replyTo: this.replyTo,
                }

                const {comment} = await this.$api.send({
                    app: 'idea',
                    method: 'comment',
                    params,
                    v: 1,
                })

                this.$refs.textarea.clear()

                this.$emit('done', comment)

                this.$toast.show(this.l10n.commentSuccessfullyAdded)
            } catch (error) {
                this.$toast.error('Failed to comment')
            }
        },
    },
}
</script>

<style lang="scss">
@import '~assets/sass/components/idea/WriteComment';
</style>
