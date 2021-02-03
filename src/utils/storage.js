/**
 * Static storage for rendering
 */
class Storage {
    constructor() {
        this.data = {
            head: {
                title: 'untitled'
            },
            info: {
                name: 'unknown'
            },
            page: {},
            common: {},
            settings: {},
            styles: {}
        }
    }

    get(additional) {
        return {...this.data, ...additional}
    }

    set(data) {
        this.data = Object.assign(this.data, data)
    }

    // TODO
    remove(path) {

    }

    // TODO
    pushToArray(objectPath, value) {

    }
}

module.exports = new Storage