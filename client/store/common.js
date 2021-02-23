export const state = () => ({
    showMainMenu: true
})

export const mutations = {
    toggleMainMenu(state: any) {
        state.showMainMenu = !state.showMainMenu
    }
}
