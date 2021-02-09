window.onload = () => {
    const mainMenuBtn = document.querySelector('.main-header__menu-btn')
    const mainMenu = document.querySelector('.main-menu')
    mainMenuBtn.addEventListener('click', () => {
        mainMenu.classList.toggle('show')
    })
}
