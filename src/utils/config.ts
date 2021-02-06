const configFilePath = `@root/config.${process.env.ENV}.json`
export const config = require(configFilePath)
