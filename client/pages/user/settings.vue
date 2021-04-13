<template>
    <div class="page-user-settings">
        <div class="page-user-settings_blocks">
            <div class="page-user-settings_blocks_block">
                <div class="page-user-settings_blocks_block_el">
                    <h3 class="page-user-settings_blocks_block_el_name"
                        :class="!l10n.changeNickname ? 'skeleton' : ''">
                        {{ l10n.changeNickname }}
                    </h3>
                    <div class="page-user-settings_blocks_block_el_body">
                        <Input class="page-user-settings_blocks_block_el_body_Input"
                               v-model="fields.nickname"
                               :min-len="1"
                               :max-len="64"
                               ref="nickname"/>
                    </div>
                </div>

                <hr>

                <div class="page-user-settings_blocks_block_el">
                    <h3 class="page-user-settings_blocks_block_el_name"
                        :class="{skeleton: !l10n.changeAvatar}">
                        {{ l10n.changeAvatar }}
                    </h3>
                    <div class="page-user-settings_blocks_block_el_body">
                        <InputFile accept="image/png, image/jpeg"
                                   :change="avatarChanged"
                                   :preview="true"
                                   :remove="avatarChanged(null)"/>
                    </div>
                </div>

                <hr>

                <div class="page-user-settings_blocks_block_el">
                    <h3 class="page-user-settings_blocks_block_el_name"
                        :class="!l10n.changeUid ? 'skeleton' : ''">
                        {{ l10n.changeUid }}
                    </h3>

                    <span class="page-user-settings_blocks_block_el_description">{{ l10n.uidDescription }} - /user/{{
                            fields.uid
                        }}</span>

                    <div class="page-user-settings_blocks_block_el_body">
                        <Input v-model="fields.uid"
                               type="text"
                               :placeholder="l10n.newUniqueIdentifier"
                               :min-len="6"
                               :max-len="32"
                               ref="uid"/>
                    </div>
                </div>

                <hr>

                <div class="page-user-settings_blocks_block_el">
                    <h4 class="page-user-settings_blocks_block_el_name"
                        :class="{skeleton: !l10n.changeLang}">
                        {{ l10n.changeLang }}
                    </h4>

                    <div class="page-user-settings_blocks_block_el_body">
                        <div class="u-horList" :class="{skeleton: !locales.length}">
                            <div class="btn hor-list_el" v-for="loc of availableLocales"
                                 @click="changeLocale(loc.code)"
                                 :key="loc.code">
                                {{ loc.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <hr>

                <div class="page-user-settings_blocks_block_el">
                    <h3 class="page-user-settings_blocks_block_el_name"
                        :class="{skeleton: !l10n.changePassword}">
                        {{ l10n.changePassword }}
                    </h3>

                    <div class="page-user-settings_blocks_block_el_body">
                        <Input v-model="fields.password"
                               type="password"
                               :placeholder="l10n.newPassword"
                               :min-len="8"
                               :max-len="64"
                               ref="password"/>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-user-settings_changed">
            <div class="page-user-settings_changed_changeList">
                <div class="page-user-settings_changed_changeList_list">
                    <div v-for="[name, value] of Object.entries(fields)"
                         class="page-user-settings_changed_changeList_list_el"
                         v-show="isChanged(name)"
                         v-if="allowedFields.includes(name)">

                        <span class="page-user-settings_changed_changeList_list_el_name">- {{ name }}: </span>
                        <span class="page-user-settings_changed_changeList_list_el_value">{{ getField(name) }}</span>
                        <span class="page-user-settings_changed_changeList_list_el_warning" v-show="warn(name)">Cannot be empty</span>
                    </div>
                </div>
            </div>

            <Btn @click="save" class="page-user-settings_changed_saveBtn" v-show="isChanged">
                Save
            </Btn>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '~assets/sass/pages/user/settings';
</style>

<script>
import Input from '@/components/ui/Input'
import {mapGetters} from 'vuex'
import InputFile from '@/components/ui/InputFile'
import Spinner from '@/components/ui/Spinner'
import Btn from "@/components/ui/Btn";

export default {
    name: 'settings',

    components: {
        Btn,
        Input,
        InputFile,
        Spinner,
    },

    data() {
        return {
            l10n: this.$t('page.user.settings'),

            changed: false,
            locales: this.$i18n.locales.filter(locale => locale.code !== this.$i18n.locale),
            fields: {},
            initial: {},
            allowedFields: [
                'uid',
                'nickname',
                'avatar',
                'password',
                'locale',
            ],
            hidden: [
                'password',
            ],
            ignoreEmpty: [
                'password',
            ],
            files: [
                'avatar',
            ],
        }
    },

    computed: {
        availableLocales() {
            return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
        },

        ...mapGetters('auth', [
            'loggedInUser',
        ]),
    },

    mounted() {
        this.fields = {
            ...this.loggedInUser,
        }
        delete this.fields.avatar

        this.initial = {
            ...this.fields,
        }
    },

    updated() {
        for (const [name, value] of Object.entries(this.fields)) {
            if (this.files.includes(name)) {
                this.changed = !!value
                continue
            }
            if (value !== this.initial[name]) {
                this.changed = true
            }
        }
    },

    methods: {
        getField(name) {
            if (!this.fields.hasOwnProperty(name)) {
                return null
            }

            const value = this.fields[name]

            if (this.files.includes(name)) {
                return value ? value.name : ''
            }

            if (this.hidden.includes(name)) {
                return '*'.repeat(value.length)
            }

            return value
        },

        isChanged(name = null) {
            if (!name) {
                for (const field of this.allowedFields) {
                    if (this.fields[field] !== this.initial[field]) {
                        return true
                    }
                }
                return false
            }

            const value = this.fields[name]
            if (this.files.includes(name)) {
                return typeof value === 'object' && value && !!value.name
            }
            return value !== this.initial[name] && this.fields[name].length
        },

        warn(name) {
            return typeof value === 'string' && !this.fields[name].length && !this.ignoreEmpty[name]
        },

        async save() {
            try {
                // FIXME: change status not working
                // if (!this.changed) {
                //     this.$toast.show('Nothing to update')
                //     return
                // }

                const params = {}

                for (const [name, value] of Object.entries(this.fields)) {
                    if (this.files.includes(name)) {
                        continue
                    }
                    if (this.initial[name] !== value && this.allowedFields.includes(name)) {
                        params[name] = value
                    }
                }

                if ('nickname' in params && !this.$refs.nickname.test() ||
                    'uid' in params && !this.$refs.uid.test() ||
                    'password' in params && !this.$refs.password.test()) {
                    return
                }

                if (Object.keys(params).length) {
                    const {updatedData} = await this.$api.send({
                        app: 'user',
                        method: 'saveSettings',
                        v: 1,
                        params,
                    })

                    this.$store.commit('auth/setUserData', updatedData)

                    this.initial = updatedData

                    this.$toast.show('Settings saved successfully')
                }

                await this.saveAvatar()
            } catch (error) {
                this.$toast.error(error.message)
            }
        },

        async saveAvatar() {
            try {
                if (!this.fields.avatar) {
                    return
                }

                const formData = new FormData()
                formData.append('avatar', this.fields.avatar)

                const {url} = await this.$api.send({
                    app: 'user',
                    method: 'updateAvatar',
                    formData,
                    v: 1,
                })

                this.$store.commit('auth/setUserData', {
                    avatar: url,
                })

                this.initial.avatar = url

                this.$toast.show('Avatar updated successfully')
            } catch (error) {
                console.log('Error:', error)
                this.$toast.error('Failed to save avatar')
            }
        },

        avatarChanged(files) {
            this.fields.avatar = files ? files[0] : null
            this.changed = !!this.fields.avatar
        },

        async changeLocale(code) {
            try {
                const params = {
                    locale: code,
                }

                const {locale} = await this.$api.send({
                    app: 'user',
                    method: 'changeLang',
                    params,
                    v: 1,
                })

                await this.$i18n.setLocale(code)

                this.$store.commit('auth/setUserData', {
                    locale,
                })

                location.reload()
            } catch (error) {
                this.$toast.error('Failed to change language')
            }
        },
    },
}
</script>
