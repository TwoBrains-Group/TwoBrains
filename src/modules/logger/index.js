const chalk = require('chalk')
const config = require('@utils/config')

/**
 * TODO:
 * - Think about using C++ addon logger instead of Node.JS (for future)
 * - Add transports
 * - Add logger options to main config
 * - Improve prettifier
 */

const loggerConfig = config.logger

const LOG_SETTINGS = {
    logLevels: {
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
    },
}

/**
 * Logger
 * Universal logger for apps, pages and methods
 *
 * @important Logger does not inherit BaseModule
 */
class Logger {
    constructor(options = {}) {
        this.options = options
        this.init()
    }

    getMessagePrefix(level, levelOptions = {}) {
        let prefix = ''

        const time = (new Date).toISOString().replace('T', ' ').replace('Z', '')
        prefix += time

        if (this.options.owner) {
            prefix += '[' + this.options.owner + '] '
        }

        prefix += chalk[levelOptions.color](level) + ': '

        return prefix
    }

    init() {
        for (const [level, levelOptions] of Object.entries(LOG_SETTINGS.logLevels)) {
            this[level] = (...messages) => {
                process.stdout.write(this.getMessagePrefix(level, levelOptions) + messages.join(' ') + '\n')
            }
        }
    }
}

module.exports = Logger