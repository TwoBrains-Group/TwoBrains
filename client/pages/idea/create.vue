<template>
    <div class="page-idea-create">
        <Form class="page-idea-create_Form" @apply="done">
            <Input type="text"
                   class="page-idea-create_Form_name"
                   :placeholder="l10n.nameYourIdea"
                   v-model="name"
                   :max-len="120"
                   :min-len="5"/>

            <Textarea class="page-idea-create_Form_text"
                      v-model="text"
                      :max-len="5000"
                      :min-len="50"
                      :warn-len="4000"
                      :placeholder="l10n.myIdeaIsAbout"/>

            <TagSearch class="page-idea-create_Form_TagSearch" :header="l10n.addTags"/>

            <Btn class="page-idea-create_Form_done" @click="done">
                {{ l10n.done }}
            </Btn>
        </Form>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/pages/idea/create';
</style>

<script>
import TagSearch from '@/components/tag/TagSearch'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Form from '@/components/ui/Form'
import Btn from "@/components/ui/Btn";

export default {
    name: 'create',

    components: {
        Btn,
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
