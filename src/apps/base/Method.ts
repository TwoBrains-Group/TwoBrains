import {storage, StorageData} from '@utils/storage'
import {Route, RouteProps} from '@apps/base/Route'
import {MustBeOverridden} from '@utils/errors'

export type MethodProps = RouteProps & {

}

export class Method extends Route {
    constructor(props = {}) {
        super(props)
    }

    run(): StorageData {
        throw new MustBeOverridden('run', this.getName())
    }
}