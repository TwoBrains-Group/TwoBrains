<template>
    <div class="user-profile">
        <header class="user-profile__header">
            <div class="user-profile__header__avatar">
                <img src="static/img/avatar.png" alt="avatar">
                <!--        <div class="user-profile__header__avatar__online"></div>-->
            </div>
            <div class="user-profile__header__nickname">
                <span>mr.kek</span>

                <!--        <div class="user-profile__header__nickname__was-online">{{page.user.wasOnline}}</div>-->
            </div>
        </header>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import 'assets/sass/apps/user/profile.scss';
</style>
