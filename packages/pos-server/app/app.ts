// npm packages
import dotenv from 'dotenv';
import express from 'express';
Promise = require('bluebird'); // eslint-disable-line
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// app imports
import { connectToDatabase } from './config';

import { notAllowedHandler, notFoundHandler, serverErrorHandler } from './controllers/error';
import router from './routers';

// global constants
dotenv.config();
const app = express();

// database
connectToDatabase();

// helmet setup
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use('/', router);

// catch-all for 404 "Not Found" errors
app.get('*', notFoundHandler);
// catch-all for 405 "Method Not Allowed" errors
app.all('*', notAllowedHandler);

app.use(serverErrorHandler);

/**
 * This file does NOT run the app. It merely builds and configures it then exports it.config
 *  This is for integration tests with supertest (see __tests__).
 */
export default app;
