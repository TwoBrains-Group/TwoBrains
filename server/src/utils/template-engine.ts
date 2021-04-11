export const escapeNames = (template: string, params: Record<string, string>, noUnused = false): string => {
    return template.replace(/{{(\w+)?}}/g, (text, variable) => {
        if (variable in params) {
            return params[variable]
        } else if (noUnused) {
            throw new Error(`Unused template param found '${variable}'`)
        }
        return text
    })
}
