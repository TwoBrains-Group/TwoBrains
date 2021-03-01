export class MustBeOverridden extends Error {
    constructor(method: string, forEntity: string = '') {
        super(`Method ${method} must be overridden${forEntity ? ' for ' + forEntity : ''}`)
    }
}
