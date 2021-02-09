import {config, Config} from '@utils/config'
import chalk from 'chalk'

const defaultConfig: Config['log'] = {
    level: 'debug'
}

const loggerConfig: Config['log'] = {...defaultConfig, ...config.log}

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

interface LogSetting {
    [key: string]: {
        color: string,
        priority: number
    }
}

const LOG_SETTINGS: LogSetting = {
    debug: {
        color: 'cyan',
        priority: 4
    },
    info: {
        color: 'green',
        priority: 3
    },
    warn: {
        color: 'yellow',
        priority: 2
    },
    error: {
        color: 'red',
        priority: 1
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
        prefix += `${time} `

        if (this.options.owner) {
            prefix += `[${this.options.owner}] `
        }

        // FIXME: Blah-blah types
        // @ts-ignore
        prefix += `${chalk[levelOptions.color](level)}: `

        return prefix
    }

    _log(level: string, ...args: string[]) {
        // @ts-ignore
        const levelOptions = LOG_SETTINGS[level]

        if (levelOptions.priority > LOG_SETTINGS[loggerConfig.level].priority) {
            return
        }

        process.stdout.write(`${this.getMessagePrefix(level, levelOptions) + args.join(' ')}\n`)
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
