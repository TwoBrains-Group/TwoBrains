export type PageData = {
    [x: string]: any
}

export type StorageData = {
    head?: object
    info?: {
        path?: string
        name?: string
    }
    page?: PageData
    common?: object
    settings?: object
    styles?: object
    auth?: {
        user: {
            userId?: number
            nickname?: string
            userUid?: string
        }
    }
}

/**
 * Static storage for rendering
 */
class Storage {
    data: StorageData

    constructor() {
        this.data = {
            head: {
                title: 'untitled',
            },
            info: {
                path: '',
                name: 'unknown',
            },
            page: {},
            common: {},
            auth: {
                user: {
                    userId: 1,
                    userUid: 'hazer-hazer',
                    nickname: 'hazer-hazer'
                }
            },
            settings: {
                debug: {
                    dump: false, // FIXME: DEV-ONLY
                }
            },
            styles: {},
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
