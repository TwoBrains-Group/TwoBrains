<template>
    <div class="project"
         :class="{hover}"
         @mouseover="hover = true"
         @mouseleave="hover = false">
        <nuxt-link :to="url"  class="project__aside">
            <div class="project__aside__image">
                <img :src="image" alt="Project image">
            </div>

            <div class="project__aside__name">
                {{ name }}
            </div>
        </nuxt-link>

        <nuxt-link class="project__info" :to="url">
            <p class="sb sb--small project__info__description">
                {{ description.slice(0, descriptionLimit) }} {{description.length > descriptionLimit ? '...' : ''}}
            </p>
        </nuxt-link>

        <div class="project__footer" @mouseover.stop @mouseover="hover = false">
            <div class="project__footer__creator">
                {{ `${l10n.createdBy} ` }}
                <nuxt-link class="project__footer__creator__link" :to="'/user/' + creator.uid">
                    {{ creator.nickname }}
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/project/Project';
</style>

<script>
export default {
    name: 'project',

    props: [
        'id',
        'uid',
        'name',
        'image',
        'description',
        'creationDatetime',
        'creator',
    ],

    data() {
        return {
            app: 'project',

            l10n: this.$t('cmp.project.Project'),

            url: `/project/${this.uid}`,
            hover: false,
            descriptionLimit: 696,
        }
    },
}
</script>
