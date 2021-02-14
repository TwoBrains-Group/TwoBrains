window.onload = () => {
    // Main menu //
    const mainMenuBtn = document.querySelector('.main-header__menu-btn')
    const mainMenu = document.querySelector('.main-menu')

    const hideMainMenu = localStorage.hideMainMenu === '1'
    if (hideMainMenu) {
        console.log(hideMainMenu)
        mainMenu.classList.remove('show')
    }

    mainMenuBtn.addEventListener('click', () => {
        mainMenu.classList.toggle('show')
        localStorage.hideMainMenu = mainMenu.classList.contains('show') ? '0' : '1'
    })
}
