export default ({store, redirect}) => {
    const {userData} = store.state.auth
    redirect(`/user/${userData.uid}`)
}
