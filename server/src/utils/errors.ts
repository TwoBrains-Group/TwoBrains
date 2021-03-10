export class MustBeOverridden extends Error {
    constructor(method: string, forEntity = '') {
        super(`Method ${method} must be overridden${forEntity ? ' for ' + forEntity : ''}`)
    }
}
