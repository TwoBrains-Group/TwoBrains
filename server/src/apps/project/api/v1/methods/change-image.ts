import {AuthUser, FormDataReq, Method, MethodRes} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {AuthError} from '@apps/base/errors'
import {File} from 'formidable'
import sharp from 'sharp'
import {v4 as uuidv4} from 'uuid'
import appRootPath from 'app-root-path'

const accessibleRoles = ['admin', 'moderator']

class ChangeImage extends Method {
    async runFormData(req: FormDataReq, user: AuthUser): Promise<MethodRes> {
        const {files, fields} = req.formData
        const {id: loggedInUserId} = user
        const {id} = fields

        const role = await this.query('getRole', {
            id,
            loggedInUserId,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'role',
        })

        if (!accessibleRoles.includes(role)) {
            throw new AuthError('Not enough rights')
        }

        const image: File = files.image as File
        const tmpPath = image.path

        const filename = uuidv4()
        const subPath = `/${process.env.UPLOADS_DIR!}/user/avatar/${filename}.jpg`.replace(/\/{2,}/g, '/')
        const newPath = `${appRootPath.toString()}/${subPath}`.replace(/\/{2,}/g, '/')
        const uri = `${process.env.HOST!}:${process.env.PORT!}/${subPath}`.replace(/\/{2,}/g, '/')

        await sharp(tmpPath).toFile(newPath)

        const {image: url} = await this.query('changeImage', {
            image: `http://${uri}`,
            id,
        }, {
            returnType: QueryReturnType.Row,
            returnField: 'image',
        })

        return {
            url,
        }
    }
}

export default new ChangeImage({
    name: 'changeImage',
    formData: true,
})
