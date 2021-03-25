import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'

const DEFAULT_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_image.png`
const DEFAULT_COVER_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_cover_image.png`

const defaultPlugins: string[] = []

class Create extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user

        const {
            name,
            tags,
            plugins,
        } = params

        const uid = name.replace(/\s+/, '_').toLowerCase()
        const image = DEFAULT_IMAGE
        const coverImage = DEFAULT_COVER_IMAGE

        const id = await this.query('create', {
            name,
            uid,
            image,
            coverImage,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        await this.query('bindTags', {
            id,
            tags,
        })

        await this.query('bindPlugin', {
            id,
            plugins: [...defaultPlugins, ...plugins],
        })

        return {
            id,
        }
    }
}

export default new Create({
    name: 'create',
})
