import {FormDataReq, MethodRes} from '@apps/base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {File} from 'formidable'
import sharp from 'sharp'
import {v4 as uuidv4} from 'uuid'
import appRootPath from 'app-root-path'
import {Modification, Operation} from '@apps/project/api/v1/methods/modification'

class ChangeImage extends Modification {
    async runFormData(req: FormDataReq): Promise<MethodRes> {
        const {files, fields} = req.formData
        const {id} = fields

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
    operation: Operation.ChangeImage,
})
