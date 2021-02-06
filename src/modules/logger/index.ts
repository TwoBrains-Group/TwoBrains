import {config} from '@utils/config'
import 'chalk'

const loggerConfig = config.logger

/**
 * TODO:
 * - Think about using C++ addon logger instead of Node.JS (for future)
 * - Add transports
 * - Add logger options to main config
 * - Improve prettifier
 */

type LoggerOptions = {
    owner: string,
}

type LogFunction = (...args: string[]) => void

interface ILogger {
    debug: LogFunction
    info: LogFunction
    warn: LogFunction
    error: LogFunction
}

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
}

/**
 * Logger
 * Universal logger for apps, pages and methods
 *
 * @important Logger does not inherit BaseModule
 */
export default class Logger implements ILogger {
    options: LoggerOptions

    constructor(options: LoggerOptions) {
        this.options = options
    }

    getMessagePrefix(level: string, levelOptions: object = {}) {
        let prefix = ''

        const time = (new Date()).toISOString().replace('T', ' ').replace('Z', '')
        prefix += time

        if (this.options.owner) {
            prefix += '[' + this.options.owner + '] '
        }

        // FIXME: Blah-blah types
        // @ts-ignore
        prefix += chalk[levelOptions.color](level) + ': '

        return prefix
    }

    _log(level: string, ...args: string[]) {
        // @ts-ignore
        const levelOptions = LOG_SETTINGS[level]
        process.stdout.write(this.getMessagePrefix(level, levelOptions) + args.join(' ') + '\n')
    }

    debug(...args: string[]) {
        this._log('debug', ...args)
    }

    info(...args: string[]) {
        this._log('info', ...args)
    }

    warn(...args: string[]) {
        this._log('warn', ...args)
    }

    error(...args: string[]) {
        this._log('error', ...args)
    }
}
