export type StorageData = {
    head?: object,
    info?: {
        path: string,
        name: string
    }
    page?: {
        [x: string]: any
    },
    common?: object,
    settings?: object,
    styles?: object
}

/**
 * Static storage for rendering
 */
class Storage {
    data: StorageData

    constructor() {
        this.data = {
            head: {
                title: 'untitled'
            },
            info: {
                path: '',
                name: 'unknown'
            },
            page: {},
            common: {},
            settings: {},
            styles: {}
        }
    }

    get(additional?: StorageData) {
        return {...this.data, ...additional}
    }

    set(updatedData: StorageData) {
        this.data = {...this.data, ...updatedData}
    }

    // TODO
    // remove(path) {
    //
    // }

    // TODO
    // pushToArray(objectPath, value) {
    //
    // }
}

export const storage = new Storage()
