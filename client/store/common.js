export const state = () => ({
    showMainMenu: true
})

export const mutations = {
    toggleMainMenu(state) {
        state.showMainMenu = !state.showMainMenu
    }
}
