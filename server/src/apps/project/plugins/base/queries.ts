export default {
    getPluginId: `
        SELECT
            p.plugin_id AS "id"
        FROM
            main.plugins AS p
        WHERE
            p.name = :name;`,
}
