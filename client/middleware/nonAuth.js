export default ({store, redirect}) => {
    if (store.state.auth.auth) {
        // TODO: Redirect back
        return redirect('/')
    }
}
