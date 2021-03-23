"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("@apps/base/api"));
const express_1 = __importDefault(require("express"));
require("path");
const app_root_path_1 = __importDefault(require("app-root-path"));
const index_1 = __importDefault(require("@apps/index"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mws_1 = __importDefault(require("./mws"));
const logger_1 = __importDefault(require("@modules/logger"));
class Server {
    constructor() {
        this.expApp = express_1.default();
        this.log = new logger_1.default({
            owner: 'server',
        });
    }
    async init() {
        const expApp = this.expApp;
        expApp.use('/public', express_1.default.static(app_root_path_1.default + '/public'));
        expApp.use(body_parser_1.default.urlencoded({
            extended: false,
        }));
        expApp.use(body_parser_1.default.json());
        expApp.use(cookie_parser_1.default());
        expApp.use(cors_1.default({
            origin: process.env.CORS_URL,
        }));
        this.log.info(`API listens on ${process.env.API_URI}`);
        this.expApp.post(process.env.API_URI, async (req, res, next) => {
            try {
                this.log.info(`Got request: ${JSON.stringify(req.body, null, 2)}`);
                const result = await api_1.default.callMethod(req, res, next);
                this.log.info(`Sent response: ${JSON.stringify(result, null, 2)}`);
                res.json(result);
            }
            catch (err) {
                this.log.error(`Got error: ${JSON.stringify(err, null, 2)}`);
                res.json({
                    error: {
                        name: err.name,
                        code: err.code,
                        message: err.message,
                        data: err.data,
                    },
                });
            }
        });
        await this.initApps();
        expApp.use(mws_1.default.error);
        expApp.use(mws_1.default.notSupported);
        const port = parseInt(process.env.PORT);
        const server = expApp.listen(port, process.env.HOST, () => {
            this.log.info('Server is listening on:', server.address());
        });
    }
    async initApps() {
        for (const [appName, app] of Object.entries(index_1.default)) {
            try {
                await app.init(this.expApp);
            }
            catch (error) {
                this.log.error(`Failed to initialize app ${appName}, error: ${error}`);
            }
        }
    }
}
exports.default = new Server();
