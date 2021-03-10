export class MethodError extends Error {
    code: number
    message: string
    data: Record<string, any>

    constructor(message: string, code = -32000, data = {}) {
        super(message)

        this.code = code || -32000
        this.message = message
        this.data = data || {}
    }
}

export class InvalidParams extends MethodError {
    constructor(message = 'Invalid params') {
        super(message, -32602, {})
    }
}

export class MethodNotFound extends MethodError {
    constructor(message = 'Method not found') {
        super(message, -32601, {})
    }
}

