export class MethodError extends Error {
    constructor(message: string) {
        super(message)
    }
}

export class InvalidParams extends MethodError {
    constructor(message: string) {
        super(message)
    }
}
