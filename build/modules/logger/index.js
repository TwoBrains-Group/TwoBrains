"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@utils/config");
require("chalk");
const loggerConfig = config_1.config.logger;
const LOG_SETTINGS = {
    debug: {
        color: 'cyan',
    },
    info: {
        color: 'green',
    },
    warn: {
        color: 'yellow',
    },
    error: {
        color: 'red',
    }
};
class Logger {
    constructor(options) {
        this.options = options;
    }
    getMessagePrefix(level, levelOptions = {}) {
        let prefix = '';
        const time = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
        prefix += time;
        if (this.options.owner) {
            prefix += '[' + this.options.owner + '] ';
        }
        prefix += chalk[levelOptions.color](level) + ': ';
        return prefix;
    }
    _log(level, ...args) {
        const levelOptions = LOG_SETTINGS[level];
        process.stdout.write(this.getMessagePrefix(level, levelOptions) + args.join(' ') + '\n');
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
//# sourceMappingURL=index.js.map