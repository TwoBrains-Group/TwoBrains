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
    },
    auth: {
        useHeader: boolean
    }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config: Record<any, any> = require(configFilePath)
