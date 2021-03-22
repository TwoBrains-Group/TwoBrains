"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getComponentData: `
        SELECT
            cl.data::jsonb AS "data"
        FROM
            main.components_l10n AS cl
            INNER JOIN main.components AS c ON cl.component_id = c.component_id
        WHERE
            c.app_name = :appName
            AND c.name = :name;`
};
//# sourceMappingURL=queries.js.map