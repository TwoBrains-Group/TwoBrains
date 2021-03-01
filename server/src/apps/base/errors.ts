export class MethodError extends Error {
    constructor(...messages: string[]) {
        super(messages.join('\n'))
    }
}

export class InvalidParams extends MethodError {
    constructor(...messages: string[]) {
        super(...messages)
    }
}
