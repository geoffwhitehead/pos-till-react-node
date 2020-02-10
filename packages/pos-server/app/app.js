// npm packages
const dotenv = require('dotenv');
const express = require('express');
Promise = require('bluebird'); // eslint-disable-line
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// app imports
const { connectToDatabase, globalResponseHeaders } = require('./config');
const { errorHandler } = require('./handlers');
const { usersRouter } = require('./routers');

// global constants
dotenv.config();
const app = express();
const {
  bodyParserHandler,
  globalErrorHandler,
  fourOhFourHandler,
  fourOhFiveHandler
} = errorHandler;

// database
connectToDatabase();

// helmet setup
app.use(helmet());

// body parser setup
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json({ type: '*/*' }));
// app.use(bodyParserHandler); // error handling specific to body parser only
app.use(bodyParser.json());

// response headers setup; CORS
// enabling CORS for all requests
app.use(cors());
// app.use(globalResponseHeaders);

// adding morgan to log HTTP requests
app.use(morgan('combined'));


app.use('/users', usersRouter);

// catch-all for 404 "Not Found" errors
app.get('*', fourOhFourHandler);
// catch-all for 405 "Method Not Allowed" errors
app.all('*', fourOhFiveHandler);

app.use(globalErrorHandler);

/**
 * This file does NOT run the app. It merely builds and configures it then exports it.config
 *  This is for integration tests with supertest (see __tests__).
 */
module.exports = app;
