export default {
    getComponentData: `
        SELECT
            cl10n.data::jsonb AS "data"
        FROM
            main.components_l10n AS cl10n
            INNER JOIN main.locales AS l ON l.code = :locale
            INNER JOIN main.components AS c ON cl10n.component_id = c.component_id
            INNER JOIN main.apps AS a ON a.app_id = c.app_id
        WHERE
            cl10n.locale_id = l.locale_id
            AND a.name = :app
            AND c.name = :name;`,

    getPageData: `
        SELECT
            pl10n.data::jsonb AS "data"
        FROM
            main.pages_l10n AS pl10n
            INNER JOIN main.locales AS l ON l.locale_id = pl10n.locale_id
            INNER JOIN main.pages AS p ON pl10n.page_id = p.page_id
            INNER JOIN main.apps AS a ON a.app_id = p.app_id
        WHERE
            a.name = :app
            AND p.name = :name
            AND l.code = :locale;`,

    getLocales: `
        SELECT
            code AS "code"
        FROM
            main.locales AS l
        WHERE
            l.state = 'enabled'::main.state
            AND l.translatable = :translatable;`,

    getAllComponentsData: `
        SELECT
            json_object_agg(
                a.name || '_' || c.name, cl10n.data
            )::jsonb AS "data"
        FROM
            main.components_l10n AS cl10n
            INNER JOIN main.locales AS l ON cl10n.locale_id = l.locale_id
            INNER JOIN main.components AS c ON cl10n.component_id = c.component_id
            INNER JOIN main.apps AS a ON c.app_id = a.app_id
        WHERE
            l.code = :locale;`,

    getAllPagesData: `
        SELECT
            json_object_agg(
                a.name || '_' || p.name, pl10n.data
            )::jsonb AS "data"
        FROM
            main.pages_l10n AS pl10n
            INNER JOIN main.locales AS l ON pl10n.locale_id = l.locale_id
            INNER JOIN main.pages AS p ON pl10n.page_id = p.page_id
            INNER JOIN main.apps AS a ON p.app_id = a.app_id
        WHERE
            l.code = :locale;`,
}
