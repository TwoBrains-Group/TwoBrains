import axios from 'axios'
import {Inject, Context} from "@nuxt/types/app";

class RequestError {
    constructor({code, message, data}) {
        this.code = code
        this.message = message
        this.data = data
    }
}

export default ({app}, inject) => {
    inject('send', async (req) => {
        try {
            const res = await axios.post(`/api/${req.v}`, req)

            if (res.result) {
                return res
            }

            if (res.error) {
                throw new RequestError(res.error)
            }
        } catch (error) {
            throw error
        }
    })
}
