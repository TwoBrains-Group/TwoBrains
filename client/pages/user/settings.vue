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
                        Change unique identifier
                    </h3>
                    <span class="user-settings__block__element__descr">This identifier will be your url - /user/{{fields.uid}}</span>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.uid" type="text" placeholder="new unique identifier" minlength="6" maxlength="32">
                    </div>
                </div>

                <hr>

                <div class="user-settings__block__element">
                    <h3 class="user-settings__block__element__name">
                        Update password
                    </h3>
                    <div class="user-settings__block__element__body">
                        <input v-model="fields.password" type="password" placeholder="new password" minlength="8" maxlength="64">
                    </div>
                </div>
            </div>
        </div>

        <div class="user-settings__changed">
            <div class="user-settings__changed__changelist" v-if="">
                <div class="user-settings__changed__changelist__list">
                    <div v-for="[name, value] of Object.entries(fields)"
                         class="user-settings__changed__changelist__list__el"
                         v-show="fields[name] !== initial[name] && fields[name].length">

                        <span class="user-settings__changed__changelist__list__el__name">{{name}}: </span>
                        <span class="user-settings__changed__changelist__list__el__value">{{getField(name)}}</span>
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

export default {
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
        }
    },

    mounted() {
        this.fields = {...this.loggedInUser}
        this.initial = {...this.fields}
    },

    updated() {
        for (const [name, value] of Object.entries(this.fields)) {
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

            if (this.hidden.includes(name)) {
                return '*'.repeat(value.length)
            }

            return value
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
