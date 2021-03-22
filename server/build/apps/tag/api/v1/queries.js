"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
            INNER JOIN main.ideas_tags AS it ON t.tag_id = it.tag_id
        GROUP BY
            t.tag_id,
            tg.tag_group_id
        ORDER BY
            COUNT(it.tag_id) DESC
        LIMIT :count;`,
};
