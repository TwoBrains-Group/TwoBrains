import {MethodRes, Req} from '@apps/_base/Method'
import {Modification, Operation} from '@apps/project/api/v1/methods/modification'

class Archive extends Modification {
    async run(req: Req): Promise<MethodRes> {
        const {params} = req
        const {id} = params

        await this.query('archive', {
            id,
        })

        return {}
    }
}

export default new Archive({
    name: 'archive',
    operation: Operation.Archive,
})

