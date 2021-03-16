import {Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

/**
 * Like method
 * Toggles like for logged in user
 */
class Like extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {
            id: ideaId,
            dislike = false,
        } = req.params
        const {id: userId} = user

        const likeStatus = await this.query('getLikeStatus', {
            ideaId,
            userId,
        }, {
            returnType: QueryReturnType.Row,
        })

        if (likeStatus && likeStatus.exists && likeStatus.dislike != dislike) {
            await this.query('unlike', {
                ideaId,
                userId,
            })

            likeStatus.exists = false
        }

        const queryName = likeStatus && likeStatus.exists ? 'unlike' : 'like'

        await this.query(queryName, {
            ideaId,
            userId,
            dislike,
        })

        // FIXME: Simplify -- remove query
        const updatedStatus = await this.query('getLikeStatus', {
            ideaId,
            userId,
        }, {
            returnType: QueryReturnType.Row,
        })

        const likesCount = await this.query('getLikesCount', {
            ideaId,
        }, {
            returnType: QueryReturnType.Row,
        })

        return {
            ...updatedStatus,
            ...likesCount,
        }
    }
}

export default new Like({
    route: 'like',
})
