import {FormDataReq, Method, MethodRes} from '@apps/base/Method'
import {File} from 'formidable'
import fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import appRootPath from 'app-root-path'
import fileType from 'file-type'
import {QueryReturnType} from '@modules/db/pool'

class UpdateAvatar extends Method {
    async runFormData(req: FormDataReq, user?: any): Promise<MethodRes> {
        const {files} = req.formData
        const {id: loggedInUserId} = user
        const avatar: File = files.avatar as File

        const tmpPath = avatar.path

        const fileInfo = await fileType.fromFile(tmpPath)
        const extname = fileInfo!.ext

        this.log.debug(`TMP Path: ${tmpPath}`)

        const data = fs.readFileSync(tmpPath)
        const filename = uuidv4()
        const subPath = `/${process.env.UPLOADS_DIR!}/user/avatar/${filename}.${extname}`.replace(/\/{2,}/g, '/')
        const newPath = `${appRootPath.toString()}/${subPath}`.replace(/\/{2,}/g, '/')
        const uri = `${process.env.HOST!}:${process.env.PORT!}/${subPath}`.replace(/\/{2,}/g, '/')

        this.log.debug(`New path: ${newPath}, uri: ${uri}`)

        fs.writeFileSync(newPath, data)

        const {avatar: url} = await this.query('updateUser', {
            avatar: `http://${uri}`,
            id: loggedInUserId,
        }, {
            unusedToNull: ['uid', 'nickname', 'password'],
            returnType: QueryReturnType.Row,
            queryDebugLog: true,
        })

        return {
            url,
        }
    }
}

export default new UpdateAvatar({
    route: 'updateAvatar',
    formData: true,
})
