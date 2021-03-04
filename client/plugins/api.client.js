class RequestError {
    constructor({code, message, data}) {
        this.code = code
        this.message = message
        this.data = data
    }
}

class Api {
    constructor(ctx) {
        this.ctx = ctx
    }

    async send(req, getRes = true) {
        const headers = {}

        // TODO!: Think about non-auth requested
        headers.Authorization = `Bearer ${this.ctx.store.state.auth.token}`

        const url = `http://${process.env.API_URI}/v${req.v}/${req.app}/${req.method}`

        const {data} = await this.ctx.$axios.post(url, req.params, {
            headers,
        })

        // console.log(`Response: ${JSON.stringify(data, null, 2)}`)

        if (data.error) {
            console.log(`Request error: ${JSON.stringify(data.error)}`)
            throw new RequestError(data.error)
        }

        if (!data.result) {
            throw new RequestError({message: 'Invalid response data'})
        }

        return getRes ? data.result : data
    }

    async redirect(to) {
        await this.ctx.redirect(to)
    }
}

export default (ctx, inject) => {
    inject('api', new Api(ctx))
}
