"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
require("path");
var app_root_path_1 = require("app-root-path");
var RenderEngine_1 = require("./RenderEngine");
var apps = require("@apps/index");
var body_parser_1 = require("body-parser");
var cookie_parser_1 = require("cookie-parser");
var Server = /** @class */ (function () {
    function Server() {
        this.expApp = express_1["default"]();
    }
    Server.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expApp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expApp = this.expApp;
                        expApp.use('/static', express_1["default"].static(app_root_path_1["default"] + '/static'));
                        expApp.use(body_parser_1["default"].json());
                        expApp.use(cookie_parser_1["default"]());
                        expApp.engine(RenderEngine_1["default"].name, RenderEngine_1["default"].engine);
                        expApp.set('view engine', RenderEngine_1["default"].name);
                        return [4 /*yield*/, this.initApps()];
                    case 1:
                        _a.sent();
                        expApp.listen(3000, function () {
                            console.log('Server is listening on port 3000');
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.initApps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, app;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = Object.values(apps);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        app = _a[_i];
                        return [4 /*yield*/, app["default"].init(this.expApp)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Server;
}());
exports["default"] = new Server();
