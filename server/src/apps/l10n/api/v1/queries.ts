export default {
    getComponentData: `
        WITH cmps AS (
            SELECT
                 jsonb_build_object(c.name, jsonb_object_agg(data.key, data.value)) AS data
                ,c.app_id
            FROM
                main.components AS c
                INNER JOIN main.components_l10n AS cl10n ON c.component_id = cl10n.component_id
                INNER JOIN main.locales AS l ON cl10n.locale_id = l.locale_id,
                jsonb_each(cl10n.data) AS data
            WHERE
                l.code = :locale
                AND l.translatable IS TRUE
            GROUP BY
                c.name,
                c.app_id
        ),
        apps AS (
            SELECT
                 a.name AS app_name
                ,jsonb_object_agg(data.key, data.value) AS data
            FROM
                cmps
                INNER JOIN main.apps AS a ON a.app_id = cmps.app_id,
                jsonb_each(cmps.data) AS data
            GROUP BY
                a.name
        )
        SELECT
            COALESCE(jsonb_object_agg(apps.app_name, apps.data), '{}')::jsonb AS "data"
        FROM
            apps;`,

    getPageData: `
        WITH pages AS (
            SELECT
                 jsonb_build_object(p.name, jsonb_object_agg(data.key, data.value)) AS data
                ,p.app_id
            FROM
                main.pages AS p
                INNER JOIN main.pages_l10n AS pl10n ON p.page_id = pl10n.page_id
                INNER JOIN main.locales AS l ON pl10n.locale_id = l.locale_id,
                jsonb_each(pl10n.data) AS data
            WHERE
                l.code = :locale
                AND l.translatable IS TRUE
            GROUP BY
                p.name,
                p.app_id
        ),
        apps AS (
            SELECT
                 a.name AS app_name
                ,jsonb_object_agg(data.key, data.value) AS data
            FROM
                pages
                INNER JOIN main.apps AS a ON a.app_id = pages.app_id,
                jsonb_each(pages.data) AS data
            GROUP BY
                a.name
        )
        SELECT
            COALESCE(jsonb_object_agg(apps.app_name, apps.data), '{}')::jsonb AS "data"
        FROM
            apps;`,

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
