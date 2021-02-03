const Logger = require('@modules/logger')

class BaseModule {
    constructor(props = {}) {
        this.log = new Logger({
            owner: this.constructor.name || props.name
        })
    }
}

module.exports = BaseModule
