import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export interface EnvConfig {
    environment: string;
    appName: string;
    port: string;
    databaseURL: string;
    accessTokenSecret: string;
    refreshTokenSecret: string;
    logs: {
        level: string;
    };
    agenda: {
        dbCollection: string;
        pooltime: string;
        concurrency: number;
    };
    agendash: {
        user: string;
        password: string;
    };
    api: {
        prefix: string;
    };
    emails: {
        apiKey: string;
        domain: string;
    };
}

export default {
    appName: 'Settled POS Server',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    databaseURL: process.env.MONGODB_URI,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    logs: {
        level: process.env.LOG_LEVEL || 'info',
    },
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
    },
    agendash: {
        user: 'agendash',
        password: '123456',
    },
    api: {
        prefix: '/api',
    },
    emails: {
        apiKey: process.env.SENDGRID_API_KEY,
        domain: process.env.SENDGRID_DOMAIN,
    },
} as EnvConfig;
