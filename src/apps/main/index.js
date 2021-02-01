const BaseApp = require('@apps/base')

class Main extends BaseApp {
    constructor(props) {
        super(props)
    }
}

module.exports = new Main({
    routePrefix: '/'
})