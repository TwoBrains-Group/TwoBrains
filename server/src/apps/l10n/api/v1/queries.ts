export default {
    getComponentData: `
        SELECT
            cl.data::jsonb AS "data"
        FROM
            main.components_l10n AS cl
            INNER JOIN main.locales AS l ON l.code = :locale
            INNER JOIN main.components AS c ON cl.component_id = c.component_id
            INNER JOIN main.pages AS p ON p.page_id = c.page_id
            INNER JOIN main.apps AS a ON a.app_id = p.app_id
        WHERE
            cl.locale_id = l.locale_id
            AND p.name = :page
            AND a.name = :app
            AND c.name = :name;`,

    getPageData: `
        SELECT
            pl10n.data::jsonb AS "data"
        FROM
            main.pages_l10n AS pl10n
            INNER JOIN locales l ON l.locale_id = pl10n.locale_id
            INNER JOIN main.pages AS p ON pl10n.page_id = p.page_id
            INNER JOIN apps AS a ON a.app_id = p.app_id
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

    // getPluginsData: `
    //     SELECT
    //         pl10n.data AS "data"
    //     FROM
    //         main.plugins_l10n AS pl10n
    //         INNER JOIN main.plugins AS p ON pl10n.plugin_id = p.plugin_id
    //         INNER JOIN main.locales AS l ON l.locale_id = pl10n.locale_id
    //     WHERE
    //         p.id = ANY(:ids)
    //         AND l.code = :locale;`,
}
