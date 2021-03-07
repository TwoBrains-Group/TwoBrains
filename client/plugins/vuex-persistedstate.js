import createPersistedState from 'vuex-persistedstate'
import Cookie from 'js-cookie'

export default ({store}) => {
    createPersistedState({
        getState: (key) => Cookie.getJSON(key),
        setState: (key, state) => Cookie.set(key, state, {expires: (100 * 365 * 24 * 60 * 60)}),
        removeItem: key => Cookies.remove(key)
    })(store)
}
