import {Method, MethodRes, Req} from "@apps/base/Method";
import {QueryReturnType} from "@modules/db/Pool";
import prettyTime from '@utils/pretty-time'

const DEFAULT_LIMIT = 25

class GetComments extends Method {
    async run(req: Req, user?: any): Promise<MethodRes> {
        const {params} = req
        const {
            id,
            limit = DEFAULT_LIMIT,
            offset = 0,
            replyTo = null,
        } = params
        const {id: loggedInUserId} = user

        let comments
        if (replyTo) {
            const queryParams = {ideaId: id, limit, offset, loggedInUserId, replyTo}
            comments = await this.query('getCommentsReplies', queryParams, {
                returnType: QueryReturnType.Rows,
            })
        } else {
            const queryParams = {id, limit, offset, loggedInUserId}
            comments = await this.query('getComments', queryParams, {
                returnType: QueryReturnType.Rows,
            })
        }

        if (comments) {
            for (const cmt of comments) {
                cmt.creationDatetime = prettyTime.prettyDiff(cmt.creationDatetime)
            }
        }

        console.log(`Comments: ${JSON.stringify(comments, null, 2)}`)

        return {comments}
    }
}

export default new GetComments({
    route: 'getComments'
})
