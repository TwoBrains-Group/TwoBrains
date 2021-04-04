"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFollowingStatus = exports.prepareUser = void 0;
exports.prepareUser = (user) => {
    exports.prepareFollowingStatus(user);
    delete user.following;
    delete user.followingYou;
    delete user.mutualFollowing;
};
exports.prepareFollowingStatus = (entity) => {
    if (entity.mutualFollowing) {
        entity.followingStatus = 'mutual_following';
        entity.followingAction = 'unfollow';
    }
    else if (entity.following) {
        entity.followingStatus = 'following';
        entity.followingAction = 'unfollow';
    }
    else if (entity.followingYou) {
        entity.followingStatus = 'following_you';
        entity.followingAction = 'follow';
    }
    else {
        entity.followingStatus = 'not_following';
        entity.followingAction = 'follow';
    }
};
