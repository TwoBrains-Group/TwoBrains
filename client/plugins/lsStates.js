/**
 * lsStates - localStorage states
 * Used as simple state storage
 */

class LsStates {
    set(name, value, session = true) {
        value = JSON.stringify(value)
        localStorage.setItem(name, value)
        session && sessionStorage.setItem(name, value)
    }

    get(name) {
        const ls = localStorage.getItem(name)
        if (ls) {
            return JSON.parse(ls)
        } else {
            return JSON.parse(sessionStorage.getItem(name))
        }
    }
}

export default new LsStates()
