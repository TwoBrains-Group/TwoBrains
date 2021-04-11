import {AuthUser, Method, MethodRes, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {nanoid} from 'nanoid'

const defaultPlugins: string[] = []

class Create extends Method {
    async run(req: Req, user: AuthUser): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user

        const {tags, visibility} = params
        let {
            name,
            description = null,
        } = params

        name = name.trim()
        description = description && description.trim()

        let {plugins} = params
        plugins = [...defaultPlugins, ...plugins]

        const uid = `${name.replace(/\s+/, '_')}_${nanoid(8)}`.toLowerCase()

        const id = await this.query('create', {
            name,
            description,
            uid,
            loggedInUserId,
            visibility,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'id',
        })

        await this.query('addUser', {
            id,
            userId: loggedInUserId,
            role: 'admin',
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
