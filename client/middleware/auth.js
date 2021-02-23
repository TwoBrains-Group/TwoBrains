export default (ctx) => {
    if (!ctx.hasOwnProperty('$auth')) {
        ctx.$auth = {
            user: null,
        }
    }

    if (!ctx.$auth.user) {
        ctx.redirect(process.env.AUTH_REDIRECT)
    }
}
