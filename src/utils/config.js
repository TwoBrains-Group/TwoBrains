const configFilePath = `@root/config.${process.env.ENV}.json`
const configFile = require(configFilePath)

module.exports = configFile