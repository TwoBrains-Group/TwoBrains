const Page = require('@apps/base/Page')

class Home extends Page {
    constructor(props) {
        super(props)
    }
}

module.exports = new Home({
    method: 'get',
    route: '/',
})