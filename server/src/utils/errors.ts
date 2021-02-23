export class MustBeOverridden extends Error {
    constructor(method: string, forEntity: string = '') {
        super(`Method ${method} must be overridden${forEntity ? ' for ' + forEntity : ''}`)
    }
}

/* DB Errors */
export class UnusedQueryParams extends Error {
    constructor(list: string[]) {
        super(`Query preparation: Unused query params found: ${JSON.stringify(list, null, 2)}`)
    }
}