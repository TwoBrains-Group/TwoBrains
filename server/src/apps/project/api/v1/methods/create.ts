import {AuthUser, Method, MethodRes, Req} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {nanoid} from 'nanoid'

const DEFAULT_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_image.png`
const DEFAULT_COVER_IMAGE = `http://${process.env.HOST}:${process.env.PORT}${process.env.UPLOADS_DIR}/project/default_cover_image.png`

const defaultPlugins: string[] = []

class Create extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user

        const {tags} = params
        let {
            name,
            description = null,
        } = params

        name = name.trim()
        description = description && description.trim()

        let {plugins} = params
        plugins = [...defaultPlugins, ...plugins]

        const uid = `${name.replace(/\s+/, '_')}_${nanoid(8)}`.toLowerCase()
        const image = DEFAULT_IMAGE
        const coverImage = DEFAULT_COVER_IMAGE

        const id = await this.query('create', {
            name,
            description,
            uid,
            image,
            coverImage,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        if (tags.length) {
            await this.query('bindTags', {
                id,
                tags,
            })
        }

        if (plugins.length) {
            await this.query('bindPlugin', {
                id,
                plugins,
            })
        }

        const creatorUid = await this.query('getCreatorUid', {
            id,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'uid',
        })

        const url = `/user/${creatorUid}/project/${uid}`

        return {
            url,
        }
    }
}

export default new Create({
    name: 'create',
})
