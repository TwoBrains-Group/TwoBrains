"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Method_1 = require("@apps/base/Method");
const pool_1 = require("@modules/db/pool");
class Load extends Method_1.Method {
    async run(req) {
        const { params } = req;
        const { locale, } = params;
        const data = {
            components: {},
            pages: {},
        };
        data.components = await this.query('getAllComponentsData', {
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
        data.pages = await this.query('getAllPagesData', {
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
        return {
            data,
        };
    }
    async loadComponentData(params, locale) {
        return await this.query('getComponentData', {
            ...params,
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
    }
    async loadPageData(params, locale) {
        return await this.query('getPageData', {
            ...params,
            locale,
        }, {
            returnType: pool_1.QueryReturnType.Row,
            returnField: 'data',
        });
    }
}
exports.default = new Load({
    name: 'load',
});
