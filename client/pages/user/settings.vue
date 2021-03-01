<template>
    <div class="user-settings">
        <div class="user-settings__blocks">
            <div class="user-settings__block">
                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Change nickname
                    </h3>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.nickname">
                    </div>
                </div>

                <hr>

                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Update password
                    </h3>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.password" type="password" placeholder="new password">
                    </div>
                </div>
            </div>
        </div>

        <div class="user-settings__changed">
            <div class="user-settings__changed__changelist" v-if="">
<!--                <h4>Changed:</h4>-->
                <div class="user-settings__changed__changelist__list">
                    <div v-for="[name, value] of Object.entries(fields)" class="user-settings__changed__changelist__list__el" v-show="fields[name] !== initial[name]">
                        <div class="user-settings__changed__changelist__list__el__name">{{name}}: </div>
                        <div class="user-settings__changed__changelist__list__el__value">{{getField(name)}}</div>
                        <div class="user-settings__changed__changelist__list__el__warning" v-show="typeof value === 'string' && !fields[name].length">Cannot be empty</div>
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

export default {
    data() {
        return {
            changed: false,
            fields: {
                nickname: null,
                password: '',
            },
            hidden: [
                'password',
            ],
            initial: {},
        }
    },

    mounted() {
        this.fields = {...this.loggedInUser}
        this.initial = {...this.fields}
    },

    updated() {
        for (const [name, value] of Object.entries(this.fields)) {
            if (value !== this.initial[name]) {
                console.log(`${name}: ${JSON.stringify(this.initial[name])} -> ${JSON.stringify(value)}`)
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

            if (this.hidden.includes(name)) {
                return '*'.repeat(value.length)
            }

            return value
        },

        async save() {
            try {
                if (!this.changed) {
                    this.$toast.show('Nothing to update')
                    return
                }

                const params = {
                    nickname: this.fields.nickname,
                    password: this.fields.password,
                }

                await this.$api.send({
                    app: 'user',
                    method: 'saveSettings',
                    v: 1,
                    params,
                })

                this.$store.commit('auth/setUserData', {...params})

                this.$toast.show('Settings saved successfully')
            } catch (error) {
                console.log(error)
                this.$toast.error(error.message)
            }
        }
    }
}
</script>

<style lang="scss">
@import '~assets/sass/apps/user/settings';
</style>
