const BaseApp = require('@apps/base')

class MainApp extends BaseApp {
    constructor() {
        super()

        this.name = 'main'
    }
}

module.exports = new MainApp