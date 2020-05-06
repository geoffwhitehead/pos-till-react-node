import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api/routes';
import config from '../config';
import helmet from 'helmet';
import attachTenant from '../api/middlewares/attachTenant';
import extendAuthorize from '../api/middlewares/extendAuthorize';

export default ({ app }: { app: express.Application }) => {
    // healthcheck
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // aids app security by setting various http headers
    app.use(helmet());

    // It shows the real origin IP in the heroku logs
    app.enable('trust proxy');

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(bodyParser.raw()); // parse raw form data
    app.use(bodyParser.json()); // parse application / json

    // auth middleware - decodes jwt and adds to req
    app.use(
        extendAuthorize.unless({
            path: [
                { url: '/api/organization', methods: ['POST'] },
                { url: '/api/auth/signup', methods: ['POST'] },
                { url: '/api/auth/signin', methods: ['POST'] },
                { url: '/api/auth/refresh-tokens', methods: ['PUT'] },
            ],
        }),
    );

    // sets user details on the container
    app.use(attachTenant);

    // Load API routes
    app.use(config.api.prefix, routes());

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    // error handlers
    app.use((err, req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            return res
                .status(err.status)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
            },
        });
    });
};
