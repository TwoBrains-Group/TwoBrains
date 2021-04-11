import {AuthUser, Method, METHOD_EVENTS, MethodProps, Req} from '@apps/_base/Method'
import {QueryReturnType} from '@modules/db/pool'
import {AccessDeniedError} from '@apps/_base/errors'

export enum Operation {
    ChangeImage = 'change_image',
    Archive = 'archive',
}

type ModificationMethodProps = {
    operation: Operation
}

export class Modification extends Method {
    operation: string

    constructor(props: MethodProps & ModificationMethodProps) {
        super(props)

        this.operation = props.operation

        this.on(METHOD_EVENTS.BEFORE, async () => await this.checkRights)
    }

    async checkRights(req: Req, user: AuthUser): Promise<void> {
        console.log('CHECK RIGHTS')

        const {params} = req
        const {id} = params
        const {id: loggedInUserId} = user

        try {
            await this.query('checkRight', {
                id,
                loggedInUserId,
                operation: this.operation,
            }, {
                returnType: QueryReturnType.Row,
                check: true,
                checkError: new AccessDeniedError('Not enough rights'),
            })
        } catch (error) {
            throw new AccessDeniedError('Not enough rights')
        }
    }
}
