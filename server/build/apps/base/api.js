"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@apps/base/errors");
const templates_1 = require("@apps/base/templates");
const logger_1 = __importDefault(require("@modules/logger"));
const formidable_1 = __importDefault(require("formidable"));
const ajv_1 = __importDefault(require("@modules/ajv"));
class Api {
    constructor() {
        this.system = {};
        this.log = new logger_1.default({
            owner: 'API',
        });
    }
    async init(appName) {
        let api;
        try {
            api = require(`@apps/${appName}/api`).default;
            if (!api) {
                throw new Error();
            }
        }
        catch (error) {
            this.log.warn(`No api directory found for app ${appName}, please check that it uses 'default' export`);
            return null;
        }
        this.system[appName] = {};
        for (const [version, entities] of Object.entries(api)) {
            let queries = {};
            let schemas = {};
            if (!entities.queries) {
                this.log.warn(`No queries found for app ${appName}`);
            }
            else {
                queries = entities.queries;
            }
            if (!entities.schemas) {
                this.log.warn(`No schemas found for app ${appName}`);
            }
            else {
                schemas = entities.schemas;
            }
            this.system[appName][version] = {
                methods: {},
            };
            for (const [methodName, method] of Object.entries(entities.methods)) {
                const schema = schemas[method.getName()] || {};
                if (!schema && !method.formData) {
                    throw new Error(`Cannot find schema for method: ${appName}/${method.getName()}`);
                }
                const validateSchema = ajv_1.default.compile(schema);
                const methodInitData = {
                    appName,
                    queries,
                    validateSchema,
                };
                try {
                    await method.init(methodInitData);
                }
                catch (error) {
                    this.log.error(`Failed to init method ${methodName} in app ${appName}:`, error);
                }
                this.system[appName][version].methods[methodName] = method;
            }
        }
    }
    async callMethod(req, res, next) {
        const reqObj = req.body;
        this.log.info(`Got request: ${JSON.stringify(reqObj, null, 2)}`);
        if (!this.system[reqObj.app]) {
            throw new Error('Service does not exists');
        }
        if (!this.system[reqObj.app][`v${reqObj.v}`]) {
            throw new Error('Version is not supported');
        }
        const method = this.system[reqObj.app][`v${reqObj.v}`].methods[reqObj.method];
        if (!method) {
            throw new Error('Method does not exists');
        }
        if (method.formData) {
            const form = new formidable_1.default.IncomingForm();
            form.parse(req.formData, async (err, fields, files) => {
                if (err) {
                    return next(err);
                }
                let result = await method.runFormData({
                    ...req.body,
                    formData: {
                        fields,
                        files,
                    },
                }, req.user && req.user.userData);
                result = templates_1.getRes(result);
                this.log.info(`Sent response: ${JSON.stringify(result, null, 2)}`);
                res.json(result);
            });
        }
        else {
            const valid = await method.validateSchema(reqObj.params);
            if (!valid) {
                if (method.validateSchema.errors) {
                    return next(new errors_1.InvalidParams(method.validateSchema.errors));
                }
                else {
                    throw new errors_1.InvalidParams();
                }
            }
            let result = await method.run(req.body, req.user && req.user.userData);
            result = templates_1.getRes(result);
            this.log.info(`Sent response: ${JSON.stringify(result, null, 2)}`);
            res.json(result);
        }
    }
}
exports.default = new Api();
