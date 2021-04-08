import Logger, {Level} from '@modules/logger'

export class BaseModule {
    log: Logger

    constructor() {
        this.log = new Logger({
            owner: this.constructor.name,
        })
    }

    setLogLevel(level: Level): this {
        this.log.setLevel(level)
        return this
    }
}
