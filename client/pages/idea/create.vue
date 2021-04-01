<template>
    <Form id="page-idea-create" @apply="done">
        <div class="new-idea-form">
            <Input type="text"
                   class="new-idea-form__name"
                   :placeholder="l10n.nameYourIdea"
                   v-model="name"
                   :max-len="120"
                   :min-len="5"/>

            <Textarea class="new-idea-form__text"
                      v-model="text"
                      :max-len="5000"
                      :min-len="50"
                      :warn-len="4000"
                      :placeholder="l10n.myIdeaIsAbout"/>

            <TagSearch :header="l10n.addTags"/>

            <div class="material-btn new-idea-form__done" @click="done">
                {{ l10n.done }}
            </div>
        </div>
    </Form>
</template>

<style lang="scss">
@import '~assets/sass/pages/idea/create';
</style>

<script>
import TagSearch from '@/components/tag/TagSearch'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Form from '@/components/ui/Form'

export default {
    name: 'create',

    components: {
        Form,
        TagSearch,
        Input,
        Textarea,
    },

    data() {
        return {
            name: '',
            text: '',
            l10n: this.$t('page.idea.create'),
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

        toggleTag(id) {
            this.tags.add(id)
        },
    },
}
</script>
