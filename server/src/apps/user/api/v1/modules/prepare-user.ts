export const prepareUser = (user: Record<string, any>): any => {
    prepareFollowingStatus(user)

    delete user.following
    delete user.followingYou
    delete user.mutualFollowing
}

export const prepareFollowingStatus = (entity: Record<string, any>): any => {
    if (entity.mutualFollowing) {
        entity.followingStatus = 'mutual_following'
        entity.followingAction = 'unfollow'
    } else if (entity.following) {
        entity.followingStatus = 'following'
        entity.followingAction = 'unfollow'
    } else if (entity.followingYou) {
        entity.followingStatus = 'following_you'
        entity.followingAction = 'follow'
    } else {
        entity.followingStatus = 'not_following'
        entity.followingAction = 'follow'
    }
}
