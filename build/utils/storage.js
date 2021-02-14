"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
class Storage {
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
                    dump: false,
                }
            },
            styles: {},
        };
    }
    get(additional) {
        return { ...this.data, ...additional };
    }
    set(updatedData) {
        this.data = { ...this.data, ...updatedData };
    }
}
exports.storage = new Storage();
//# sourceMappingURL=storage.js.map