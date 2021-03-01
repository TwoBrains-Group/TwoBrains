export default ({store, redirect}) => {
    console.log(`Check auth: ${JSON.stringify(store.state.auth, null, 2)}`)
    if (!store.state.auth.token) {
        return redirect('/auth')
    }
}
