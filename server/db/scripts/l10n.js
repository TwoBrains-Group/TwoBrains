const fs = require('fs')
const sqlFormatter = require('sql-formatter')
const en = require('./l10n/en')
const ru = require('./l10n/ru')

const l10n = {
    en,
    ru,
}
const localesNames = Object.keys(l10n)

const normType = v => v === null ? 'null' : typeof v
const deepDiff = (obj1, obj2) => {
    if (typeof obj1 !== typeof obj2) {
        return `[Different types: ${normType(obj1)} - ${normType(obj2)}]`
    } else if (typeof obj1 !== 'object') {
        return null
    }

    const diff = {}
    for (const [key, val] of Object.entries(obj1)) {
        if (!(key in obj2)) {
            diff[key] = val
        } else {
            const eq = deepDiff(obj1[key], obj2[key])
            if (eq) {
                diff[key] = eq
            }
        }
    }

    if (!Object.keys(diff).length) {
        return null
    }

    return diff
}

for (let i = 0; i < localesNames.length; ++i) {
    for (let j = 0; j < localesNames.length; ++j) {
        const lhs = localesNames[i]
        const rhs = localesNames[j]
        if (lhs === rhs) continue
        console.log(`Diff between ${lhs} and ${rhs}:`, JSON.stringify(deepDiff(l10n[lhs], l10n[rhs]), null, 4))
    }
}

const getLocaleName = l => `${l}_locale`
const getAppName = a => `${a === '*' ? 'any' : a}_app`
const getPageName = (a, p) => `${getAppName(a)}_${p === '*' ? 'any' : p}_page`
const getCmpName = (a, c) => `${getAppName(a)}_${c}_cmp`

const apps = new Set()
const pages = new Set()
const cmps = new Set()

const insertApp = a => {
    const appVarName = getAppName(a)
    if (apps.has(appVarName)) return ''
    apps.add(appVarName)
    return `\t\t-- ${a} --\n\t\tINSERT INTO main.apps (name) VALUES ('${a}') RETURNING app_id INTO ${appVarName};\n`
}

const insertPage = (a, p, l, l10n) => {
    const pageVarName = getPageName(a, p)
    let query = ''
    if (!pages.has(pageVarName)) {
        query += `\t\t-- ${a}_${p} --\n\t\tINSERT INTO main.pages (app_id, name) VALUES (${getAppName(a)}, '${p}') RETURNING page_id INTO ${pageVarName};\n`
        pages.add(pageVarName)
    }
    query += `\t\tINSERT INTO main.pages_l10n (page_id, locale_id, data)\n\t\tVALUES (${pageVarName}, ${getLocaleName(l)}, '${JSON.stringify(l10n, null, '\t\t\t')}');\n\n`
    return query
}

const insertCmp = (a, c, l, l10n) => {
    const cmpVarName = getCmpName(a, c)
    let query = ''
    if (!cmps.has(cmpVarName)) {
        query += `\t\t-- ${a}_${c} --\n\t\tINSERT INTO main.components (app_id, name) VALUES (${getAppName(a)}, '${c}') RETURNING component_id INTO ${cmpVarName};\n`
        cmps.add(cmpVarName)
    }
    query += `\t\tINSERT INTO main.components_l10n (component_id, locale_id, data)\n\t\tVALUES (${cmpVarName}, ${getLocaleName(l)}, '${JSON.stringify(l10n, null, '\t\t\t')}');\n\n`
    return query
}

let appsQuery = ''
let pagesQuery = ''
let cmpsQuery = ''

for (const [locale, localeData] of Object.entries(l10n)) {
    if (localeData.page) {
        for (const [app, pages] of Object.entries(localeData.page)) {
            appsQuery += insertApp(app)
            for (const [page, pageData] of Object.entries(pages)) {
                pagesQuery += insertPage(app, page, locale, pageData)
            }
        }
    }

    if (localeData.cmp) {
        for (const [app, cmps] of Object.entries(localeData.cmp)) {
            appsQuery += insertApp(app)
            for (const [cmp, cmpData] of Object.entries(cmps)) {
                cmpsQuery += insertCmp(app, cmp, locale, cmpData)
            }
        }
    }
}

const appsDecl = [...apps].map(appVar => {
    return `\t\t${appVar} INT2;`
}).join('\n')

const pagesDecl = [...pages].map(pageVar => {
    return `\t\t${pageVar} INT2;`
}).join('\n')

const cmpsDecl = [...cmps].map(cmpVar => {
    return `\t\t${cmpVar} INT2;`
}).join('\n')

const localesDecl = Object.keys(l10n).map(l => {
    return `\t\t${getLocaleName(l)} INT2 = (SELECT locale_id
                         FROM main.locales
                         WHERE code = '${l}');`
}).join('\n')

const query = `
BEGIN TRANSACTION;
SET search_path TO main;

TRUNCATE main.apps CASCADE;

DO
$$
    DECLARE
        -- locales --
${localesDecl}

        -- apps --
${appsDecl}

        -- pages --
${pagesDecl}

        -- components --
${cmpsDecl}

    BEGIN
        ----------
        -- APPS --
        ----------

${appsQuery}
        ---------------
        ---- PAGES ----
        ---------------

${pagesQuery}
        --------------------
        ---- COMPONENTS ----
        --------------------

${cmpsQuery}
END $$;

COMMIT;`

fs.writeFileSync(`${__dirname}/l10n.sql`, query.trim().replace(/"(.*)'(.*)"/gm, '"$1\'\'$2"').replace(/}'\);/gm, '\t\t}\');'), {
    encoding: 'utf8',
})
