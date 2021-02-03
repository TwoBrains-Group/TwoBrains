const storage = require('@utils/storage')
const Route = require('@apps/base/Route')
const {MustBeOverridden} = require('@utils/errors')

class Method extends Route {
    constructor(props = {}) {
        super(props)
    }

    run() {
        throw new MustBeOverridden('run', this.getName())
    }
}