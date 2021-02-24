class RequestError {
    constructor({code, message, data}) {
        this.code = code
        this.message = message
        this.data = data
    }
}

export class Api {
    constructor(ctx) {
        this.ctx = ctx
    }

    async send(req) {
        const headers = {}

        if (req.token) {
            headers.Authorization = `Bearer ${req.token}`
        }

        const url = `http://${process.env.API_URI}/v${req.v}/${req.app}/${req.method}`

        const {data} = await this.ctx.$axios.post(url, req.params, {
            headers,
        })

        console.log(`Response: ${JSON.stringify(data, null, 2)}`)

        if (data.error) {
            throw new RequestError(data.error)
        }

        if (!data.result) {
            throw new RequestError({message: 'Invalid response data'})
        }

        return data
    }

    async redirect(to) {
        console.log(`redirect: ${to}`)
        await this.ctx.redirect(to)
    }
}

export default (ctx, inject) => {
    inject('api', new Api(ctx))
}
