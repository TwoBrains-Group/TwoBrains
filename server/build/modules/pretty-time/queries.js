"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getL10n: `
        SELECT
            cl10n.data AS "data"
        FROM
            main.common_l10n AS cl10n
        WHERE
            name = 'prettyTime';`,
};
