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

    getTop: `
        SELECT
             t.tag_id AS "id"
            ,t.label AS "label"
            ,tg.tag_group_id AS "groupId"
            ,tg.label AS "groupLabel"
            ,COUNT(it.tag_id)
        FROM
            main.tags AS t
            LEFT JOIN main.tag_groups AS tg ON t.tag_group_id = tg.tag_group_id
            LEFT JOIN main.ideas_tags AS it ON t.tag_id = it.tag_id
            LEFT JOIN main.projects_tags AS pt ON t.tag_id = pt.tag_id
        GROUP BY
            t.tag_id,
            tg.tag_group_id
        ORDER BY
            COUNT(it.tag_id) DESC,
            COUNT(pt.tag_id) DESC,
            random()
        LIMIT :count;`,

    search: `
        SELECT
             t.tag_id AS "id"
            ,t.label AS "label"
            ,tg.label AS "groupLabel"
            ,ts_rank_cd(t.tsv, q) AS tag_rank
            ,ts_rank_cd(tg.tsv, q) AS tag_group_rank
        FROM
            main.tags AS t
            LEFT JOIN main.tag_groups AS tg ON t.tag_group_id = tg.tag_group_id,
            to_tsquery('simple', :searchQuery || ':*') AS q
        WHERE
            t.tsv @@ q
            OR tg.tsv @@ q
        ORDER BY
            tag_rank,
            tag_group_rank
        LIMIT :limit;`,
}
