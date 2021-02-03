const Page = require('@apps/base/Page')
const DB = require('@modules/db')

class Home extends Page {
    constructor(props) {
        super(props)
    }

    run(req, res) {
        return {
            kek: 'lol',
        }
    }
}

module.exports = new Home({
    method: 'get',
    route: '/',
})
