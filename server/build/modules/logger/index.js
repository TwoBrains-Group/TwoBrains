"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lf = void 0;
const config_1 = require("@utils/config");
const chalk_1 = __importDefault(require("chalk"));
const defaultConfig = {
    level: 'debug',
};
const loggerConfig = {
    ...defaultConfig,
    ...config_1.config.log,
};
const LOG_SETTINGS = {
    debug: {
        color: 'cyan',
        priority: 4,
    },
    info: {
        color: 'green',
        priority: 3,
    },
    warn: {
        color: 'yellow',
        priority: 2,
    },
    error: {
        color: 'red',
        priority: 1,
    },
};
exports.lf = (strings, ...ipValues) => {
    return strings.reduce((total, current, index) => {
        total += current;
        if (index in ipValues) {
            const value = ipValues[index];
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                total += JSON.stringify(value, null, 2);
            }
            else if (Array.isArray(value)) {
                total += value?.join(', ');
            }
            else {
                total += String(value);
            }
        }
        return total;
    }, '');
};
class Logger {
    constructor(options) {
        this.options = options;
    }
    getMessagePrefix(level, levelOptions = {}) {
        let prefix = '';
        const time = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
        prefix += `${time} `;
        if (this.options.owner) {
            prefix += `[${this.options.owner}] `;
        }
        const color = levelOptions.color;
        prefix += `${chalk_1.default[color](level)}:`;
        return prefix;
    }
    _log(level, ...args) {
        const levelOptions = LOG_SETTINGS[level];
        if (levelOptions.priority > LOG_SETTINGS[loggerConfig.level].priority) {
            return;
        }
        console.log(this.getMessagePrefix(level, levelOptions), ...args);
    }
    debug(...args) {
        this._log('debug', ...args);
    }
    info(...args) {
        this._log('info', ...args);
    }
    warn(...args) {
        this._log('warn', ...args);
    }
    error(...args) {
        this._log('error', ...args);
    }
}
exports.default = Logger;
