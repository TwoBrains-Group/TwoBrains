export const escapeNames = (template: string, params: Record<string, string>): string => {
    return template.replace(/{{(\w+)?}}/g, (text, variable) => {
        if (variable in params) {
            return params[variable]
        }
        return text
    })
}
