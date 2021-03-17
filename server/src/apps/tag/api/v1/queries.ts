export default {
    getList: `
        SELECT
             t.tag_id AS "id"
            ,t.label AS "label"
            ,tg.tag_group_id AS "groupId"
            ,tg.label AS "groupLabel"
        FROM
            main.tags AS t
            LEFT JOIN main.tag_groups AS tg ON t.tag_group_id = tg.tag_group_id
        WHERE
            TRUE
            /* ids:
            AND t.tag_id = ANY(:ids)
            */
            /* labels:
            AND t.label = ANY(:labels)
            */
            /* groupIds:
            AND tg.tag_group_id = ANY(:groupIds)
            */
            /* groupLabels:
            AND tg.label = ANY(:groupLabels)
            */;`,
}
