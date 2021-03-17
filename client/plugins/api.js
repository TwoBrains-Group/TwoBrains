import axios from 'axios'

const isProd = process.env.NODE_ENV === 'production'

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

    async send(req, getRes = true) {
        const headers = {}

        // TODO!: Think about non-auth requested
        headers.Authorization = `Bearer ${this.ctx.store.state.auth.token}`

        if (req.formData) {
            headers['Content-Type'] = 'multipart/form-data'
        } else {
            headers['Content-Type'] = 'application/json'
        }

        const url = `http://${process.env.API_URI}/v${req.v}/${req.app}/${req.method}`

        !isProd && console.log('Send request:', req)

        const {data} = await axios.post(url, req, {
            headers,
        })

        !isProd && console.log('Got response:', data)

        if (data.error) {
            !isProd && console.log(`Request error: ${JSON.stringify(data.error)}`)
            throw new RequestError(data.error)
        }

        if (!data.error && !data.result) {
            throw new RequestError({
                message: 'Invalid response data',
            })
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
