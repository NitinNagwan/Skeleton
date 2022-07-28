const { createLogger,transports,format } = require("winston")

const customformat = format.combine(format.timestamp(), format.printf(info => {
    return `${info.timestamp} - [${info.level.toUpperCase().padEnd(3)}] - ${info.message} `
}))

const logger = createLogger({
    // format: customformat,
    transports: [
        new transports.Console()
    ]
})


module.exports = logger