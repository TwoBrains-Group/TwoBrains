import {Method, MethodProps, MethodRes, Req} from "@apps/base/Method";
import {QueryReturnType} from "@modules/db/Pool";

/**
 * Like method
 * Toggles like for logged in user
 */
class Like extends Method {
    constructor(props: MethodProps) {
        super(props)
    }

    async run(req: Req, user?: any): Promise<MethodRes> {
        const {id: ideaId} = req.params
        const {id: userId} = user

        const liked = await this.query('isLiked', {ideaId, userId}, {
            returnType: QueryReturnType.Row,
            returnField: 'liked',
        })

        const queryName = liked ? 'unlike' : 'like'

        await this.query(queryName, {ideaId, userId}, {
            returnType: QueryReturnType.None,
        })

        return {
            liked: !liked,
        }
    }
}

export default new Like({
    route: 'like',
})
