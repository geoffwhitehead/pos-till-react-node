// npm packages
import dotenv from 'dotenv';
import express from 'express';
Promise = require('bluebird'); // eslint-disable-line
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { extendAuthorize } from './middlewares/extendAuthorize';
import { notAllowedHandler, notFoundHandler, serverErrorHandler } from './controllers/error';
import router from './routers';
import { connectToDatabase } from './config';
import { bindNamespace } from './middlewares/bindNamespace';

// global constants
dotenv.config();
const app = express();

// database
connectToDatabase();

// helmet setup
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.json());

app.use(cors());

// context
app.use(bindNamespace);

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// auth
app.use(extendAuthorize);
// router
app.use('/', router);

// catch-all for 404 "Not Found" errors
app.get('*', notFoundHandler);
// catch-all for 405 "Method Not Allowed" errors
app.all('*', notAllowedHandler);

app.use(serverErrorHandler);

process.on('unhandledRejection', (reason: any, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${reason.message}`);
    process.exit(1);
});
process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
process.on('SIGTERM', signal => {
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    process.exit(0);
});

process.on('SIGINT', signal => {
    console.log(`Process ${process.pid} has been interrupted`);
    process.exit(0);
});

process.on('beforeExit', code => {
    // Can make asynchronous calls
    setTimeout(() => {
        console.log(`Process will exit with code: ${code}`);
        process.exit(code);
    }, 100);
});

process.on('exit', code => {
    // Only synchronous calls
    console.log(`Process exited with code: ${code}`);
});
/**
 * This file does NOT run the app. It merely builds and configures it then exports it.config
 *  This is for integration tests with supertest (see __tests__).
 */
export default app;
