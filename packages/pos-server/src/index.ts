import express from 'express';
import config from './config';
import Logger from './loaders/logger';
import 'reflect-metadata'; // We need this in order to use @Decorators - remove once refactored to  use functions
import loaders from './loaders';
// Promise = require('bluebird'); // eslint-disable-line
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { extendAuthorize } from './middlewares/extendAuthorize';
// import { notAllowedHandler, notFoundHandler, serverErrorHandler } from './controllers/error';
// import router from './routers';
// import { connectToDatabase } from './config';
// import { bindNamespace } from './middlewares/bindNamespace';

const startServer = async () => {
    const app = express();

    await loaders({ expressApp: app });

    app.listen(config.port, err => {
        if (err) {
            Logger.error(err);
            process.exit(1);
            return;
        }
        Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    });
};

startServer();

// database
// connectToDatabase();

// helmet setup
// app.use(helmet());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw());
// app.use(bodyParser.json());

// app.use(cors());

// context
// app.use(bindNamespace);

// // adding morgan to log HTTP requests
// app.use(morgan('combined'));

// // auth
// app.use(
//     extendAuthorize({}).unless({
//         path: ['/', { url: '/organization', methods: ['POST'] }],
//     }),
// );
// // router
// app.use('/', router);

// // catch-all for 404 "Not Found" errors
// app.get('*', notFoundHandler);
// // catch-all for 405 "Method Not Allowed" errors
// app.all('*', notAllowedHandler);

// app.use(serverErrorHandler);

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
