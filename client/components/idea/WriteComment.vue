<template>
    <Form class="idea-WriteComment" @apply="done">
        <div class="idea-WriteComment_text">
            <Textarea class="idea-WriteComment_text_Textarea"
                      v-model="text"
                      ref="textarea"
                      :placeholder="l10n.writeAComment"
                      :min-len="15"
                      :max-len="600"
                      :warn-len="450"/>
        </div>

        <div class="btn idea-WriteComment_done"
             @click="done">
            <i class="fas fa-paper-plane"></i>
        </div>
    </Form>
</template>

<style lang="scss" scoped>
@import '~assets/sass/components/idea/WriteComment';
</style>

<script>
import Textarea from '@/components/ui/Textarea'
import Form from '@/components/ui/Form'

export default {
    name: 'WriteComment',

    components: {
        Form,
        Textarea,
    },

    props: {
        type: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },

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
                    text: this.text,
                }

                if (this.type === 'comment') {
                    params.replyTo = this.id
                } else {
                    params.ideaId = this.id
                }

                const method = this.type === 'idea' ? 'comment' : 'replyToComment'

                const {comment} = await this.$api.send({
                    app: 'idea',
                    method,
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

        focus() {
            this.$refs.textarea.focus()
        },
    },
}
</script>
