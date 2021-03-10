import {config, Config} from '@utils/config'
import chalk, {Chalk} from 'chalk'

const defaultConfig: Config['log'] = {
    level: 'debug',
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
}

// Log format template literal
export const lf = (strings: TemplateStringsArray, ...ipValues: any[]): string => {
    return strings.reduce((total: string, current: string, index: any) => {
        total += current
        if (index in ipValues) {
            const value = ipValues[index]
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                total += JSON.stringify(value, null, 2)
            } else if (Array.isArray(value)) {
                total += value?.join(', ')
            } else {
                total += String(value)
            }
        }
        return total
    }, '')
}

/**
 * Logger
 * Universal logger for pages, pages and methods
 *
 * @important Logger does not inherit BaseModule
 */
export default class Logger implements ILogger {
    options: LoggerOptions

    constructor(options: LoggerOptions) {
        this.options = options
    }

    getMessagePrefix(level: string, levelOptions: Record<string, any> = {}): string {
        let prefix = ''

        const time = (new Date()).toISOString().replace('T', ' ').replace('Z', '')
        prefix += `${time} `

        if (this.options.owner) {
            prefix += `[${this.options.owner}] `
        }

        const color: keyof Chalk = levelOptions.color

        prefix += `${(chalk[color] as Chalk)(level)}:`

        return prefix
    }

    _log(level: string, ...args: any[]): void {
        const levelOptions = LOG_SETTINGS[level]

        if (levelOptions.priority > LOG_SETTINGS[loggerConfig.level].priority) {
            return
        }

        // FIXME: JSON.stringify |--__--|
        console.log(this.getMessagePrefix(level, levelOptions), ...args)
    }

    debug(...args: any[]): void {
        this._log('debug', ...args)
    }

    info(...args: any[]): void {
        this._log('info', ...args)
    }

    warn(...args: any[]): void {
        this._log('warn', ...args)
    }

    error(...args: any[]): void {
        this._log('error', ...args)
    }
}
