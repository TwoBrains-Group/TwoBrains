const configFilePath = `@root/config.${process.env.ENV}.json`

export type Config = {
    db: {
        connection: {
            host: string,
            port: number,
            database: string,
            password: string
        }
    },
    log: {
        level: string
    }
}

export const config: Config = require(configFilePath)
