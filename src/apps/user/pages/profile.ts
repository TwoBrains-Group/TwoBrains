import {Page, PageProps, Request, Response} from '@apps/base/Page'
import {PageData} from '@utils/storage'
import {lf} from "@modules/logger";
import {QueryReturnType} from '@modules/db/Pool'
import prettyTime from '@utils/pretty-time'

// Time diff telling that user is online now (in seconds)
const ONLINE_THRESHOLD = 60

class Profile extends Page {
    constructor(props: PageProps) {
        super(props)
    }

    async run(req: Request, res: Response): Promise<PageData> {
        const {uid} = req.params

        const now = new Date()

        const user: any = await this.query('getUserByUid', {uid}, {
            returnType: QueryReturnType.ROW,
        })

        user.avatar = `/static/img/${user.avatar}`
        user.wasOnline = `Was online ${prettyTime.prettyDiff(user.online, now)}`
        user.online = prettyTime.diffSec(user.online, now) <= ONLINE_THRESHOLD

        return {
            user,
        }
    }
}

export default new Profile({
    route: '/:uid',
})
