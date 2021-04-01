"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@apps/base/errors");
const templates_1 = require("@apps/base/templates");
const logger_1 = __importDefault(require("@modules/logger"));
const formidable_1 = __importDefault(require("formidable"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@utils/config");
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
                const methodInitData = {
                    appName,
                    queries,
                    schema,
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
    getMethod(req) {
        const reqObj = req.body;
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
        return method;
    }
    async callMethod(req, res, next) {
        const reqObj = req.body;
        const method = this.getMethod(req);
        let user = undefined;
        if (method.auth) {
            let token;
            if (config_1.config.auth.useHeader && req.headers.authorization.split(' ')[0] === 'Bearer') {
                console.log('use bearer');
                token = req.headers.authorization.split(' ')[1].trim();
                console.log('token', token);
            }
            else if (reqObj.token) {
                token = reqObj.token;
            }
            else {
                throw new errors_1.UnauthorizedError();
            }
            try {
                await jsonwebtoken_1.default.verify(token, Buffer.from(process.env.JWT_SECRET, 'base64'), {
                    algorithms: ['HS256'],
                });
                const jwtData = await jsonwebtoken_1.default.decode(token, {
                    complete: true,
                });
                user = jwtData.payload.userData;
                if (!user) {
                    throw new errors_1.UnauthorizedError('invalid_payload');
                }
            }
            catch (error) {
                this.log.error(error);
                throw new errors_1.UnauthorizedError('invalid_token');
            }
        }
        if (method.formData) {
            const form = new formidable_1.default.IncomingForm();
            form.parse(req.formData, async (err, fields, files) => {
                if (err) {
                    return next(err);
                }
                const result = await method.runFormData({
                    ...req.body,
                    formData: {
                        fields,
                        files,
                    },
                }, user);
                return templates_1.getRes(result);
            });
        }
        else {
            await method.validate(req.body);
            const result = await method.run(req.body, user);
            return templates_1.getRes(result);
        }
    }
}
exports.default = new Api();
