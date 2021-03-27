<template>
    <div class="project"
         :class="{hover}"
         @mouseover="hover = true"
         @mouseleave="hover = false">
        <div class="project__body">
            <div class="project__body__image">
                <img :src="image" alt="Project image">
            </div>

            <nuxt-link class="project__body__info" :to="url">
                <div class="project__body__info__name">
                    {{ name }}
                </div>
                <p class="sb sb--small project__body__info__description">
                    {{ description.slice(0, descriptionLimit) }}
                    {{ description.length > descriptionLimit ? '...' : '' }}
                </p>
            </nuxt-link>
        </div>

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

            url: `/user/${this.creator.uid}/project/${this.uid}`,
            hover: false,
            descriptionLimit: 696,
        }
    },
}
</script>
