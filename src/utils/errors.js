class MustBeOverridden extends Error {
    constructor(method, forEntity = '') {
        super(`Method ${method} must be overridden${forEntity ? ' for ' + forEntity : ''}`)
    }
}


module.exports = {
    MustBeOverridden,
}