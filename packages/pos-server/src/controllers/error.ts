import { APP_NAME } from '../config';

const bodyParserHandler = (error, request, response, next) => {
    if (error instanceof SyntaxError || error instanceof TypeError) {
        // console.error(error);
        return next(new Error('400'));
    }
};

const notFoundHandler = (request, response, next) => {
    return next(new Error('404'));
};

const notAllowedHandler = (request, response, next) => {
    return next(new Error('405'));
};

const serverErrorHandler = (error, request, response) => {
    let err = error;
    if (!(error instanceof Error)) {
        err = new Error('500');
    }

    return response.status(err.status).json(err);
};

export { bodyParserHandler, notFoundHandler, notAllowedHandler, serverErrorHandler };
