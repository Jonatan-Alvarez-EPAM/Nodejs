import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint } = format;

const appTransports = {
    console: new transports.Console(),
    errorFile: new transports.File({ level: 'error', filename: 'error.log' }),
    debugFile: new transports.File({ level: 'debug', filename: 'debug.log' }),
};

const appLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [appTransports.console, appTransports.errorFile, appTransports.debugFile],
});

const logError = (methodName, params, errorMessage) => {
    appLogger.error(`${methodName} ${params} ${errorMessage}`);
}

process.on('unhandledRejection', (reason, p) => {
    appLogger.error(`${reason} Unhandled Rejection at Promise: ${p}`);
}).on('uncaughtException', err => {
    appLogger.error(`${err} Uncaught Exception thrown.`);
    process.exit(1);
});

export { appLogger, appTransports, logError };