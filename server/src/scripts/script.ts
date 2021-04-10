import Logger from '@modules/logger'

export class Script {
    name: string
    log: Logger

    constructor(name: string) {
        this.name = name

        this.log = new Logger({
            owner: `script_${this.name}`,
            printTime: false,
        })
    }
}
