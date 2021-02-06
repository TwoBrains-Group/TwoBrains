"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("path");
const app_root_path_1 = __importDefault(require("app-root-path"));
const RenderEngine_1 = __importDefault(require("./RenderEngine"));
const apps = __importStar(require("@apps/index"));
class Server {
    constructor() {
        this.expApp = express_1.default();
    }
    init() {
        const expApp = this.expApp;
        expApp.use('/static', express_1.default.static(app_root_path_1.default + '/static'));
        expApp.engine(RenderEngine_1.default.name, RenderEngine_1.default.engine);
        expApp.set('view engine', RenderEngine_1.default.name);
        this.initApps();
        expApp.listen(3000, () => {
            console.log('Server is listening on port 3000');
        });
    }
    initApps() {
        for (const app of Object.values(apps)) {
            app.init(this.expApp);
        }
    }
}
exports.default = new Server();
//# sourceMappingURL=index.js.map