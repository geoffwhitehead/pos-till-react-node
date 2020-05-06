import winston from 'winston';
import config from '../config';
import Container from 'typedi';

const transports = [];

// if (process.env.NODE_ENV !== 'production') {
//     transports.push(new winston.transports.Console({
//       format: winston.format.simple()
//     }));

export type LoggerService = winston.Logger;

export const createLoggerContext = (
    params: { organizationId?: string; userId?: string; service?: string; fn?: string; err?: any },
    other: Record<string, string> = {},
) => {
    const { organizationId, userId, service, fn } = params;

    return {
        organizationId: organizationId,
        userId: userId,
        service,
        fn,
        ...other,
    };
};

if (process.env.NODE_ENV !== 'development') {
    transports.push(new winston.transports.Console({ format: winston.format.simple() }));
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat()),
        }),
    );
}

const LoggerInstance = winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
    ),
    transports,
});

export default LoggerInstance;
