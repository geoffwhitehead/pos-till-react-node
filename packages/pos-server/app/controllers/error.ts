import { APP_NAME } from '../config';
import { APIError } from '../helpers';

const bodyParserHandler = (error, request, response, next) => {
    if (error instanceof SyntaxError || error instanceof TypeError) {
        // console.error(error);
        return next(new APIError(400, 'Bad Request', 'Malformed JSON.'));
    }
};

const notFoundHandler = (request, response, next) => {
    return next(
        new APIError(404, 'Resource Not Found', `${request.path} is not valid path to a ${APP_NAME} resource.`),
    );
};

const notAllowedHandler = (request, response, next) => {
    return next(
        new APIError(405, 'Method Not Allowed', `${request.method} method is not supported at ${request.path}.`),
    );
};

const serverErrorHandler = (error, request, response) => {
    let err = error;
    if (!(error instanceof APIError)) {
        err = new APIError(500, error.type, error.message);
    }

    return response.status(err.status).json(err);
};

export { bodyParserHandler, notFoundHandler, notAllowedHandler, serverErrorHandler };
