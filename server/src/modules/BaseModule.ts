import Logger from '@modules/logger'

export type ModuleProps = {
    name?: string
}

export class BaseModule {
    log: Logger

    constructor(props: ModuleProps = {}) {
        this.log = new Logger({
            owner: this.constructor.name || props.name
        })
    }
}
