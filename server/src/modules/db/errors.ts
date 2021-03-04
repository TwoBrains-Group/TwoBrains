export class DBError extends Error {
    fatal: boolean

    constructor(message: string, fatal: boolean = true) {
        super()
        this.message = message
        this.fatal = fatal
    }

    hide() {
        if (process.env.ENV === 'prod') {
            this.message = 'Oops... Something went wrong'
        }
        return this
    }
}

export class UnusedQueryParams extends DBError {
    constructor(list: string[]) {
        super(`Query preparation: Unused query params found: ${JSON.stringify(list, null, 2)}`)
    }
}
