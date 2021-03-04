<template>
    <div class="user-settings">
        <div class="user-settings__blocks">
            <div class="user-settings__block">
                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Change nickname
                    </h3>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.nickname" minlength="1" maxlength="64">
                    </div>
                </div>

                <hr>

                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Change profile picture
                    </h3>
                    <div class="user-settings__block__element__body">
                        <InputFile accept="image/png, image/jpeg" :change="avatarChanged"/>
                    </div>
                </div>

                <hr>

                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Change unique identifier
                    </h3>
                    <span
                        class="user-settings__block__element__descr">This identifier will be your url - /user/{{
                            fields.uid
                        }}</span>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.uid" type="text" placeholder="new unique identifier" minlength="6"
                               maxlength="32">
                    </div>
                </div>

                <hr>

                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Update password
                    </h3>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.password" type="password" placeholder="new password" minlength="8"
                               maxlength="64">
                    </div>
                </div>
            </div>
        </div>

        <div class="user-settings__changed">
            <div class="user-settings__changed__changelist" v-if="">
                <div class="user-settings__changed__changelist__list">
                    <div v-for="[name, value] of Object.entries(fields)"
                         class="user-settings__changed__changelist__list__el"
                         v-show="isChanged(name)">

                        <span class="user-settings__changed__changelist__list__el__name">- {{ name }}: </span>
                        <span class="user-settings__changed__changelist__list__el__value">{{ getField(name) }}</span>
                        <span class="user-settings__changed__changelist__list__el__warning" v-show="warn(name)">Cannot be empty</span>
                    </div>
                </div>
            </div>

            <div @click="save" class="material-btn user-settings__changed__save-btn">
                Save
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import InputFile from "@/components/ui/InputFile";

export default {
    components: {InputFile},

    data() {
        return {
            changed: false,
            fields: {},
            initial: {},
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

    mounted() {
        this.fields = {...this.loggedInUser}
        // delete this.fields.avatar

        this.initial = {...this.fields}
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

    computed: {
        ...mapGetters('auth', [
            'loggedInUser',
        ]),
    },

    methods: {
        getField(name) {
            if (!this.fields.hasOwnProperty(name)) {
                return null
            }

            const value = this.fields[name]

            if (this.files.includes(name)) {
                console.log(`Get file:`, name, value.name)
                return value ? value.name : ''
            }

            if (this.hidden.includes(name)) {
                return '*'.repeat(value.length)
            }

            return value
        },

        isChanged(name) {
            const value = this.fields[name]
            if (this.files.includes(name)) {
                console.log(`Check file ${name}:`, typeof value === 'object' && value.name)
                return typeof value === 'object' && !!value.name
            }
            return value !== this.initial[name] && this.fields[name].length
        },

        warn(name) {
            return typeof value === 'string' && !this.fields[name].length && !this.ignoreEmpty[name]
        },

        async save() {
            try {
                if (!this.changed) {
                    this.$toast.show('Nothing to update')
                    return
                }

                const params = {}

                for (const [name, value] of Object.entries(this.fields)) {
                    if (this.files.includes(name)) {
                        continue
                    }
                    if (this.initial[name] !== value) {
                        params[name] = value
                    }
                }

                const updatedData = await this.$api.send({
                    app: 'user',
                    method: 'saveSettings',
                    v: 1,
                    params,
                })

                this.$store.commit('auth/setUserData', updatedData)

                this.$toast.show('Settings saved successfully')

                await this.saveAvatar()
            } catch (error) {
                console.log(error)
                this.$toast.error(error.message)
            }
        },

        async saveAvatar() {
            try {
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

                this.$toast.show('Avatar updated successfully')
            } catch (error) {
                // FIXME: Common message
                this.$toast.error('Failed to save avatar')
            }
        },

        avatarChanged(files) {
            this.fields.avatar = files[0]
            console.log(`Avatar changed:`, this.fields.avatar)
        },
    }
}
</script>

<style lang="scss">
@import '~assets/sass/apps/user/settings';
</style>
