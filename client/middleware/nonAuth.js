export default ({store, redirect}) => {
    console.log(`Check non-auth: ${JSON.stringify(store.state.auth, null, 2)}`)
    if (store.state.auth.token) {
        // TODO: Redirect back
        return redirect('/')
    }
}
