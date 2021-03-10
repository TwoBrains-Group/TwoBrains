import Logger from '@modules/logger'

export class BaseModule {
    log: Logger

    constructor() {
        this.log = new Logger({
            owner: this.constructor.name,
        })
    }
}
