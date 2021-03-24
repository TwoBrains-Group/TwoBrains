export default {
    getList: `
        SELECT
             p.plugin_id AS "id"
            ,p.uid AS "uid"
        FROM
            main.plugins AS p;`,
}
