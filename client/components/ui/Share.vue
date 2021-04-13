<template>
    <div class="ui-Share">
        <div v-if="link" class="ui-Share_link">
            <input class="" readonly :value="url" ref="link">
            <div class="btn ui-Share_link_copy"
                 v-tooltip="{
                    content: 'copy',
                 }"
                 @click="copy">
                <i class="far fa-clipboard"></i>
            </div>
        </div>

        <div class="ui-Share_socialNetworks">
            <div class="btn ui-Share_socialNetworks_el"
                 :class="'_' + sn.name"
                 v-for="sn of socialNetworks"
                 @click="shareTo(sn.url)">
                <i class="fab" :class="sn.icon"></i>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '~assets/sass/components/ui/Share';
</style>

<script>
export default {
    name: 'Share',

    props: {
        link: {
            type: String,
        },
    },

    data() {
        return {
            l10n: this.$t('cmp.*.Share'),

            url: `${process.env.URL}${this.link}`,

            socialNetworks: [
                {
                    name: 'facebook',
                    icon: 'fa-facebook',
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.URL}/${this.link}`)}`,
                },
                {
                    name: 'vk',
                    icon: 'fa-vk',
                    url: '',
                },
                {
                    name: 'twitter',
                    icon: 'fa-twitter',
                    url: '',
                },
                {
                    name: 'googlePlus',
                    icon: 'fa-google-plus-g',
                    url: '',
                },
            ],
        }
    },

    methods: {
        copy() {
            const link = this.$refs.link
            link.select()
            link.setSelectionRange(0, 99999)
            document.execCommand('copy')

            // TODO: L10N
            this.$toast.info('Link copied to clipboard')
        },

        shareTo(url) {
            window.open(url, '_blank')
        },
    },
}
</script>
